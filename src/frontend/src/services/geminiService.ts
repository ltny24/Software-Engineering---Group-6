import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================
// Gemini AI Service — academic-only chatbot
// ============================================================

const API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY && API_KEY.length > 5) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const SYSTEM_PROMPT = `You are an academic advisor chatbot for HCMUS (Ho Chi Minh City University of Science) student portal.

RULES:
- ONLY answer questions related to university academics: courses, grades, tuition, registration, graduation, studying, exams, academic policies, course content explanation, study tips, career advice related to majors.
- If asked about non-academic topics (politics, entertainment, coding help unrelated to coursework, personal advice, etc.), politely decline: "Tôi chỉ có thể trả lời các câu hỏi liên quan đến học tập tại HCMUS."
- Answer in the SAME LANGUAGE as the user's question (Vietnamese for Vietnamese questions, English for English questions).
- Be helpful, concise, and encouraging.
- If you don't know the exact answer, provide general academic guidance and suggest contacting the university office.
- Keep responses under 500 characters unless explaining a course in detail.
- For course explanations, explain what the course covers, why it's important, prerequisites, and career relevance.`;

interface ChatHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function askGemini(message: string, history: ChatHistory[] = []): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const chat = model.startChat({
    systemInstruction: { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    history: history.slice(-10), // keep last 10 messages for context
  });

  const result = await chat.sendMessage(message);
  const response = result.response;
  return response.text();
}
