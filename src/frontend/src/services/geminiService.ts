import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchCourseData, formatCoursesForPrompt } from '../data/courses';
import { generateLocalResponse } from './localChatbotService';
import axiosInstance from '../api/axiosInstance';

// ============================================================
// Gemini AI Service — academic chatbot with course RAG + streaming
// Fallback chain: Direct Gemini → Backend proxy → Offline local
// With retry, caching, and offline fallback for quota resilience.
// ============================================================

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

// ============================================================
// Config
// ============================================================

/** Max retries for transient errors (429, 500, 503) */
const MAX_RETRIES = 2;

/** Base delay in ms for exponential backoff (1s → 3s → 9s) */
const RETRY_BASE_DELAY_MS = 1000;

/** Multiplier for each retry step */
const RETRY_MULTIPLIER = 3;

/** Cache entry TTL in ms (5 minutes) */
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Max cache entries before evicting oldest */
const MAX_CACHE_ENTRIES = 50;

/** Timeout for backend proxy call in ms */
const BACKEND_TIMEOUT_MS = 25_000;

// ============================================================
// In-memory response cache
// ============================================================

interface CacheEntry {
  response: string;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();

/**
 * Build a normalized cache key from message + history.
 */
function buildCacheKey(message: string, history: ChatHistory[]): string {
  const historyKey = history
    .slice(-6) // only last 6 messages for cache key
    .map((h) => `${h.role}:${h.parts.map((p) => p.text).join('|')}`)
    .join('||');
  return `${historyKey}|||${message}`.toLowerCase().trim();
}

function getCachedResponse(key: string): string | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.response;
}

function setCachedResponse(key: string, response: string): void {
  // Evict oldest if at capacity
  if (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = responseCache.keys().next().value;
    if (oldest) responseCache.delete(oldest);
  }
  responseCache.set(key, { response, timestamp: Date.now() });
}

// ============================================================
// Gemini client (lazy init)
// ============================================================

let genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI | null {
  if (!genAI && API_KEY && API_KEY.length > 5) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

// ============================================================
// System prompt
// ============================================================

const SYSTEM_PROMPT = `You are an AI academic advisor chatbot for HCMUS (Ho Chi Minh City University of Science) student portal.

YOUR ROLE:
You are the GATEKEEPER. You decide whether a question is related to university academics or not. Do NOT rely on any external keyword list — use your own judgment.

WHAT TO ANSWER (answer helpfully in detail):
- Questions about specific courses (content, prerequisites, credits, textbooks, difficulty, career relevance)
- Questions about study path / learning roadmap / curriculum planning
- Questions about grades, GPA, academic performance
- Questions about tuition, fees, payments, scholarships
- Questions about graduation progress, degree requirements
- Questions about registration, enrollment, class scheduling
- Questions about academic policies, rules, procedures
- Questions about exams, assignments, studying techniques
- Questions about majors, career advice related to university studies
- Greetings and general help requests about academic topics

WHAT TO REFUSE (politely decline in the same language as the user):
- Non-academic topics: politics, entertainment, sports, personal advice unrelated to study
- Coding/debugging help unrelated to coursework
- General knowledge questions not related to university

RESPONSE RULES:
- Answer in the SAME LANGUAGE as the user's question.
- Be helpful, concise, and encouraging.
- If RELEVANT COURSE INFORMATION is provided below, use it to give accurate, detailed answers about the course.
- If no course data is provided, provide general academic guidance based on your knowledge.
- Keep responses concise and well-structured. Use emojis and formatting for readability.
- For course explanations: cover what the course is about, why it's important, prerequisites, and career relevance.`;

// ============================================================
// Types
// ============================================================

interface ChatHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ============================================================
// Helpers
// ============================================================

/**
 * Ensure chat history is valid for Gemini: must start with a 'user' message.
 */
function sanitizeHistory(history: ChatHistory[]): ChatHistory[] {
  const firstUserIdx = history.findIndex((h) => h.role === 'user');
  if (firstUserIdx === -1) return [];
  const valid = history.slice(firstUserIdx);
  return valid.slice(-20); // 10 user + 10 model = 20 max
}

/**
 * Build the full system instruction including RAG course context.
 */
function buildSystemInstruction(message: string, userContext?: string): string {
  const relevantCourses = searchCourseData(message);
  const courseContext = formatCoursesForPrompt(relevantCourses);
  const contextStr = userContext
    ? `\n\n--- USER CONTEXT ---\nYou are talking to the following student. Use this context to personalize your answers:\n${userContext}`
    : '';
  return SYSTEM_PROMPT + courseContext + contextStr;
}

/**
 * Check if an error is retryable (quota / server overload).
 */
function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota') ||
    msg.includes('500') ||
    msg.includes('502') ||
    msg.includes('503') ||
    msg.includes('INTERNAL') ||
    msg.includes('UNAVAILABLE')
  );
}

/**
 * Extract a user-friendly transition message.
 */
function formatFallbackMessage(source: string): string {
  const messages: Record<string, string> = {
    direct_quota: '⏳ Gemini API đã đạt giới hạn. Đang thử qua backend proxy...',
    backend_unavailable: '🔄 Backend không khả dụng. Đang chuyển sang chế độ ngoại tuyến...',
    offline: '📚 Đang trả lời từ dữ liệu khóa học cục bộ (chế độ ngoại tuyến):',
  };
  return messages[source] || '';
}

/**
 * Sleep for `ms` milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Backend proxy fallback
// ============================================================

/**
 * Check if the user's message looks like a greeting (short, simple).
 */
function isGreetingMessage(message: string): boolean {
  const lower = message.trim().toLowerCase();
  return (
    lower.length < 15 &&
    /^(xin chào|hello|hi|hey|chào|chao|good morning|good afternoon|good evening|greetings|yo|sup|what's up|chào bạn|chao ban)[\s!.,]*$/i.test(
      lower
    )
  );
}

/**
 * Check if a backend response is a generic/non-answer that doesn't
 * actually address the user's question. If so, we should fall through
 * to offline mode which has course data.
 */
function isGenericGreetingResponse(response: string): boolean {
  // Patterns that indicate the backend didn't actually answer the question
  const genericPatterns = [
    'tôi có thể giúp bạn',
    'I can help you with',
    'What would you like help',
    'Cảm ơn câu hỏi của bạn',
    'Để có câu trả lời chi tiết hơn',
    'bạn có thể hỏi',
    'Hãy hỏi tôi',
  ];
  const matchesPattern = genericPatterns.some((p) => response.includes(p));
  return matchesPattern && response.length < 1000;
}

/**
 * Try calling the backend chatbot proxy endpoint.
 * The backend has its own Gemini API key (server-side, never exposed).
 * Returns the reply text if successful AND useful, throws otherwise.
 */
async function tryBackendProxy(message: string): Promise<string> {
  const { data } = await axiosInstance.post(
    '/api/v1/chatbot/chat',
    {
      message,
      contextType: 'GENERAL',
    },
    { timeout: BACKEND_TIMEOUT_MS }
  );
  const replyText = data?.replyText || '';

  if (!replyText || replyText.length < 10) {
    throw new Error('Empty or too-short backend response');
  }

  // If the user asked a specific question but the backend gave a generic greeting,
  // treat it as a failure so we fall through to offline mode (which has course data).
  if (!isGreetingMessage(message) && isGenericGreetingResponse(replyText)) {
    console.log('Backend returned generic greeting for specific question, will use offline mode');
    throw new Error('Backend response too generic for this question');
  }

  return replyText;
}

// ============================================================
// Core: ask Gemini with multi-layer fallback
// ============================================================

/**
 * Send a message to Gemini and get the full response (non-streaming).
 * Fallback chain: Direct Gemini → Backend proxy → Offline local.
 */
export async function askGemini(message: string, history: ChatHistory[] = []): Promise<string> {
  // 1. Check cache
  const cacheKey = buildCacheKey(message, history);
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const client = getGenAI();
  const systemText = buildSystemInstruction(message);

  // 2. Try direct Gemini with retries
  if (client) {
    let lastError: unknown;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const model = client.getGenerativeModel({ model: 'gemini-flash-latest' });
        const chat = model.startChat({
          systemInstruction: { role: 'user', parts: [{ text: systemText }] },
          history: sanitizeHistory(history),
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();
        setCachedResponse(cacheKey, response);
        return response;
      } catch (err) {
        lastError = err;
        if (!isRetryableError(err) || attempt === MAX_RETRIES) break;
        const delay = RETRY_BASE_DELAY_MS * Math.pow(RETRY_MULTIPLIER, attempt);
        console.warn(`Gemini attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
    console.warn('Direct Gemini call failed:', lastError);
  }

  // 3. Try backend proxy (server-side API key, different quota pool)
  try {
    console.log('Trying backend proxy for Gemini...');
    const backendResponse = await tryBackendProxy(message);
    if (backendResponse && backendResponse.length > 10) {
      setCachedResponse(cacheKey, backendResponse);
      return backendResponse;
    }
  } catch (backendErr) {
    console.warn('Backend proxy unavailable:', backendErr);
  }

  // 4. Offline fallback — always works, uses local course data
  console.log('Falling back to offline local response');
  const localResponse = generateLocalResponse(message);
  const fullText = `${formatFallbackMessage('offline')}\n\n${localResponse}`;
  return fullText;
}

/**
 * Send a message to Gemini and stream the response.
 * Fallback chain: Direct Gemini streaming → Direct Gemini non-streaming → Backend proxy → Offline local.
 *
 * Calls `onChunk` with the FULL accumulated text each time a new chunk arrives.
 * Returns the complete text when done.
 */
export async function askGeminiStream(
  message: string,
  history: ChatHistory[],
  onChunk: (fullText: string) => void,
  userContext?: string
): Promise<string> {
  // 1. Check cache — if hit, deliver immediately
  const cacheKey = buildCacheKey(message, history);
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    onChunk(cached);
    return cached;
  }

  const client = getGenAI();
  const systemText = buildSystemInstruction(message, userContext);
  const validHistory = sanitizeHistory(history);

  // 2. Try direct Gemini streaming with retries
  if (client) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const model = client.getGenerativeModel({ model: 'gemini-flash-latest' });
        const chat = model.startChat({
          systemInstruction: { role: 'user', parts: [{ text: systemText }] },
          history: validHistory,
        });

        const result = await chat.sendMessageStream(message);

        let fullText = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (!chunkText) continue;

          if (chunkText.length > fullText.length && chunkText.startsWith(fullText)) {
            fullText = chunkText;
          } else {
            fullText += chunkText;
          }
          onChunk(fullText);
        }

        setCachedResponse(cacheKey, fullText);
        return fullText;
      } catch (streamErr) {
        // eslint-disable-next-line no-console
        console.warn('Gemini streaming failed:', streamErr);

        if (isRetryableError(streamErr) && attempt < MAX_RETRIES) {
          const delay = RETRY_BASE_DELAY_MS * Math.pow(RETRY_MULTIPLIER, attempt);
          console.warn(`Gemini stream attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }
        break; // non-retryable or exhausted — move to next fallback
      }
    }

    // 2b. Try direct Gemini non-streaming (same client, simpler call)
    try {
      console.log('Falling back to non-streaming Gemini...');
      const model = client.getGenerativeModel({ model: 'gemini-flash-latest' });
      const chat = model.startChat({
        systemInstruction: { role: 'user', parts: [{ text: systemText }] },
        history: validHistory,
      });

      const result = await chat.sendMessage(message);
      const fullText = result.response.text();
      onChunk(fullText);
      setCachedResponse(cacheKey, fullText);
      return fullText;
    } catch (nonStreamErr) {
      console.warn('Non-streaming Gemini also failed:', nonStreamErr);
    }
  }

  // 3. Try backend proxy (server-side API key, different quota)
  try {
    console.log('Trying backend proxy for Gemini...');
    const backendResponse = await tryBackendProxy(message);
    if (backendResponse && backendResponse.length > 10) {
      onChunk(backendResponse);
      setCachedResponse(cacheKey, backendResponse);
      return backendResponse;
    }
  } catch (backendErr) {
    console.warn('Backend proxy unavailable:', backendErr);
  }

  // 4. Ultimate fallback — offline local response (always works)
  console.log('All remote options exhausted, using offline local response');
  const localResponse = generateLocalResponse(message);
  const fullText = `${formatFallbackMessage('offline')}\n\n${localResponse}`;
  onChunk(fullText);
  return fullText;
}
