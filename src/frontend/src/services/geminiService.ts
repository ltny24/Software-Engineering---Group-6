import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchCourseData, formatCoursesForPrompt } from '../data/courses';

// ============================================================
// Gemini AI Service — academic chatbot with course RAG + streaming
// ============================================================

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY && API_KEY.length > 5) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

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

/**
 * Ensure chat history is valid for Gemini: must start with a 'user' message.
 * Also limits history length to prevent token overflow.
 */
function sanitizeHistory(history: ChatHistory[]): ChatHistory[] {
  // Remove leading 'model' entries until we find the first 'user'
  const firstUserIdx = history.findIndex((h) => h.role === 'user');
  if (firstUserIdx === -1) return []; // no user messages at all

  const valid = history.slice(firstUserIdx);
  // Keep last 10 exchanges to stay within token limits
  return valid.slice(-20); // 10 user + 10 model = 20 max
}

interface ChatHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Build the full system instruction including RAG course context.
 */
function buildSystemInstruction(message: string): string {
  const relevantCourses = searchCourseData(message);
  const courseContext = formatCoursesForPrompt(relevantCourses);
  return SYSTEM_PROMPT + courseContext;
}

/**
 * Extract a user-friendly error message from a Gemini API error.
 */
function formatGeminiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
    return '⏳ API đã đạt giới hạn yêu cầu (rate limit). Vui lòng đợi khoảng 20 giây rồi thử lại.';
  }
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('API key')) {
    return '🔑 API key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra REACT_APP_GEMINI_API_KEY trong file .env.';
  }
  if (msg.includes('500') || msg.includes('INTERNAL') || msg.includes('UNAVAILABLE')) {
    return '🔄 Máy chủ Gemini đang bận. Vui lòng thử lại sau.';
  }
  if (msg.includes('SAFETY') || msg.includes('BLOCKED')) {
    return '⚠️ Câu hỏi của bạn đã bị chặn bởi bộ lọc an toàn của Gemini. Vui lòng diễn đạt lại.';
  }

  // Generic fallback with the actual error for debugging
  console.error('Gemini API error:', msg);
  return `⚠️ Lỗi kết nối đến Gemini API. Chi tiết: ${msg.substring(0, 150)}`;
}

/**
 * Send a message to Gemini and get the full response (non-streaming).
 */
export async function askGemini(message: string, history: ChatHistory[] = []): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not configured — please set REACT_APP_GEMINI_API_KEY in .env and restart the dev server');
  }

  const systemText = buildSystemInstruction(message);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const chat = model.startChat({
    systemInstruction: { role: 'user', parts: [{ text: systemText }] },
    history: sanitizeHistory(history),
  });

  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();
}

/**
 * Send a message to Gemini and stream the response.
 * Falls back to non-streaming immediately on any streaming failure.
 *
 * Calls `onChunk` with the FULL accumulated text each time a new chunk arrives.
 * Returns the complete text when done.
 */
export async function askGeminiStream(
  message: string,
  history: ChatHistory[],
  onChunk: (fullText: string) => void,
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not configured — please set REACT_APP_GEMINI_API_KEY in .env and restart the dev server');
  }

  const systemText = buildSystemInstruction(message);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const validHistory = sanitizeHistory(history);

  // Try streaming once — no retries, to keep response fast
  try {
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

    return fullText;
  } catch (streamErr) {
    // Streaming failed — fall back to non-streaming immediately (no delay)
    console.warn('Gemini streaming failed, falling back to non-streaming:', streamErr);
  }

  // Non-streaming fallback (single attempt, no retry)
  try {
    const chat = model.startChat({
      systemInstruction: { role: 'user', parts: [{ text: systemText }] },
      history: validHistory,
    });

    const result = await chat.sendMessage(message);
    const fullText = result.response.text();
    onChunk(fullText); // deliver all at once
    return fullText;
  } catch (err) {
    throw new Error(formatGeminiError(err));
  }
}
