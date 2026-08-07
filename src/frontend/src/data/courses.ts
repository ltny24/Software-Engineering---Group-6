// ============================================================
// Course Knowledge Base — parsed from CLC_DeCuongTomTat.pdf
// Provides search & formatting for chatbot RAG context.
// ============================================================

import coursesData from './courses.json';

export interface CourseInfo {
  code: string;
  name: string;
  englishName: string;
  knowledgeBlock: string;
  totalCredits: number;
  theoryHours: number;
  practiceHours: number;
  exerciseHours: number;
  prerequisites: string;
  description: string;
  objectives: string;
  content: string;
  resources: string;
}

const courses: CourseInfo[] = coursesData as CourseInfo[];

/**
 * Normalize Vietnamese text for comparison (lowercase, remove diacritics).
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacritics
    .replace(/[–—-]/g, '-') // normalize dashes
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
}

/**
 * Check if a query contains a course code pattern (e.g., CSC10004, csc 10004).
 */
function extractCode(query: string): string | null {
  const match = query.match(/([A-Za-z]{2,4})\s*(\d{5,6})/i);
  if (match) {
    return (match[1] + match[2]).toUpperCase();
  }
  return null;
}

/**
 * Score how well a course matches the query.
 * Returns 0-100, higher = better match.
 */
function scoreCourse(course: CourseInfo, query: string): number {
  const q = normalize(query);
  const code = normalize(course.code);
  const name = normalize(course.name);
  const engName = normalize(course.englishName);
  const desc = normalize(course.description);
  const content = normalize(course.content);

  let score = 0;

  // Exact code match
  if (q === code) return 100;
  if (code.includes(q)) score += 60;
  if (q.includes(code)) score += 60;

  // Name match (continuous substring)
  if (name.includes(q)) score += 50;
  if (q.includes(name)) score += 50;

  // English name match
  if (engName && engName.includes(q)) score += 40;

  // Keyword matches in name
  const qWords = q.split(/\s+/).filter((w) => w.length >= 2);
  const nameWords = name.split(/\s+/);
  const matchedQueryWords = new Set<string>();

  for (const qw of qWords) {
    for (const nw of nameWords) {
      if (nw.includes(qw) || qw.includes(nw)) {
        score += 10;
        matchedQueryWords.add(qw);
      }
    }
  }

  // Bonus: word coverage in name (higher = more query words found in name)
  if (qWords.length > 0 && matchedQueryWords.size > 0) {
    const coverage = matchedQueryWords.size / qWords.length;
    score += Math.round(coverage * 40); // up to +40 for 100% coverage
  }

  // Search in description and content for additional scoring
  if (desc && desc.includes(q)) score += 15;
  if (content && content.includes(q)) score += 10;

  // Bonus for matching keywords in description
  for (const qw of qWords) {
    if (qw.length >= 3 && desc.includes(qw)) score += 3;
    if (qw.length >= 3 && content.includes(qw)) score += 2;
  }

  return Math.min(100, score);
}

/**
 * Search courses by name, code, or keywords.
 * Returns courses sorted by relevance score (best match first).
 * Only returns courses with score >= 15 (meaningful match).
 */
export function searchCourseData(query: string): CourseInfo[] {
  if (!query || query.trim().length < 2) return [];

  // Try exact code match first
  const code = extractCode(query);
  if (code) {
    const exact = courses.find((c) => c.code === code);
    if (exact) return [exact];
  }

  // Score all courses
  const scored = courses
    .map((c) => ({ course: c, score: scoreCourse(c, query) }))
    .filter((s) => s.score >= 15)
    .sort((a, b) => b.score - a.score);

  // Return top matches (max 3 to keep prompt small)
  return scored.slice(0, 3).map((s) => s.course);
}

/**
 * Get a course by its exact code.
 */
export function getCourseByCode(code: string): CourseInfo | null {
  const upper = code.toUpperCase().trim();
  return courses.find((c) => c.code === upper) || null;
}

/**
 * Format a single course into a compact text block for the Gemini prompt.
 * Keeps it concise to save tokens.
 */
export function formatCourseForPrompt(course: CourseInfo): string {
  const lines: string[] = [
    `📖 ${course.code} — ${course.name}${course.englishName ? ` (${course.englishName})` : ''}`,
    `   Credits: ${course.totalCredits} (Theory: ${course.theoryHours}h, Practice: ${course.practiceHours}h)`,
    `   Knowledge Block: ${course.knowledgeBlock}`,
  ];

  if (course.prerequisites) {
    lines.push(`   Prerequisites: ${course.prerequisites}`);
  }

  if (course.description) {
    // Truncate description to ~300 chars
    const desc =
      course.description.length > 300
        ? course.description.substring(0, 300) + '...'
        : course.description;
    lines.push(`   Description: ${desc}`);
  }

  if (course.objectives) {
    // Truncate objectives to ~300 chars
    const obj =
      course.objectives.length > 300
        ? course.objectives.substring(0, 300) + '...'
        : course.objectives;
    lines.push(`   Objectives: ${obj}`);
  }

  if (course.content) {
    // Truncate content to ~300 chars
    const cont =
      course.content.length > 300 ? course.content.substring(0, 300) + '...' : course.content;
    lines.push(`   Topics: ${cont}`);
  }

  return lines.join('\n');
}

/**
 * Format multiple courses into a context block for the Gemini prompt.
 */
export function formatCoursesForPrompt(courses: CourseInfo[]): string {
  if (courses.length === 0) return '';

  const header = '\n\n--- RELEVANT COURSE INFORMATION ---\n';
  const body = courses.map(formatCourseForPrompt).join('\n\n');
  const footer =
    "\nUse the above course information to answer the student's question accurately. If the information is not sufficient, provide general academic guidance.";

  return header + body + footer;
}

/**
 * Get total number of available courses.
 */
export function getCourseCount(): number {
  return courses.length;
}
