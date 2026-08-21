// ============================================================
// Local Chatbot Service — offline fallback when Gemini API is
// unavailable (quota exceeded, network error, etc.)
// Uses course data + rule-based matching to generate responses.
// ============================================================

import { searchCourseData, getCourseCount, type CourseInfo } from '../data/courses';

// ============================================================
// Pattern matching for common question types
// ============================================================

interface IntentMatch {
  intent: string;
  confidence: number;
}

function detectIntent(message: string): IntentMatch {
  const lower = message.toLowerCase();

  // Greetings (exact/short)
  if (
    /^(xin chào|hello|hi|hey|chào|chao|good morning|good afternoon|good evening)[\s!.,]*$/i.test(
      lower
    )
  ) {
    return { intent: 'greeting', confidence: 1.0 };
  }

  // Thanks (exact/short)
  if (/^(cảm ơn|thanks|thank you|cám ơn|tks|ty|tyvm)[\s!.,]*$/i.test(lower)) {
    return { intent: 'thanks', confidence: 1.0 };
  }

  // Help / capabilities
  if (
    /(help|giúp|hỗ trợ|what can you do|capabilit|chức năng|hướng dẫn|cách dùng|cách sử dụng)/i.test(
      lower
    ) &&
    lower.length < 40
  ) {
    return { intent: 'help', confidence: 0.9 };
  }

  // Course suggestion / next semester
  if (
    /(gợi ý|suggest|recommend|nên học|đăng ký|register|enroll|môn nào|học kỳ (tới|sau)|next (semester|term)|what (courses|should i take))/i.test(
      lower
    )
  ) {
    return { intent: 'course_suggestion', confidence: 0.9 };
  }

  // Graduation / progress
  if (
    /(tốt nghiệp|graduat|ra trường|tiến độ|progress|degree|bằng|when (can|will) i graduate|how close|how far|bao giờ (ra|tốt))/i.test(
      lower
    )
  ) {
    return { intent: 'graduation', confidence: 0.9 };
  }

  // GPA / grades
  if (/(điểm|gpa|grade|điểm số|kết quả|score|mark|học lực|xếp loại)/i.test(lower)) {
    return { intent: 'grades', confidence: 0.85 };
  }

  // Tuition / fees
  if (
    /(học phí|tuition|fee|payment|thanh toán|đóng tiền|nợ|cost|price|chi phí|bao nhiêu tiền)/i.test(
      lower
    )
  ) {
    return { intent: 'tuition', confidence: 0.85 };
  }

  // Prerequisites
  if (/(điều kiện|prerequisite|required|yêu cầu|tiên quyết|học trước)/i.test(lower)) {
    return { intent: 'prerequisites', confidence: 0.85 };
  }

  // Academic policies
  if (
    /(quy (định|chế)|policy|rule|regulation|thủ tục|procedure|deadline|hạn|kỳ hạn)/i.test(lower)
  ) {
    return { intent: 'policies', confidence: 0.8 };
  }

  // Exams / schedule
  if (/(thi|lịch thi|exam|schedule|thời khóa biểu|timetable|lịch học|kiểm tra|test)/i.test(lower)) {
    return { intent: 'exams', confidence: 0.8 };
  }

  // Course-related: any message with môn, course, course code, or asking about a subject
  if (
    /môn|course|môn học|học phần|giải thích|explain|describe|tell me about|what is|cho (tôi|em|mình|anh|chị) biết|nói về|trình bày|tìm hiểu về|học về|dạy về|thông tin/i.test(
      lower
    ) ||
    /\b[A-Za-z]{2,4}\s*\d{5,6}\b/i.test(message)
  ) {
    return { intent: 'course_info', confidence: 0.9 };
  }

  // Default: general academic — will still search courses
  if (lower.length > 3) {
    return { intent: 'general_academic', confidence: 0.5 };
  }

  return { intent: 'unknown', confidence: 0.0 };
}

// ============================================================
// Course info formatting (shared)
// ============================================================

function formatSingleCourse(course: CourseInfo): string {
  return `📖 **${course.code} — ${course.name}**
${course.englishName ? `*${course.englishName}*\n` : ''}
• **Tín chỉ:** ${course.totalCredits} (Lý thuyết: ${course.theoryHours}h, Thực hành: ${course.practiceHours}h, Bài tập: ${course.exerciseHours}h)
• **Khối kiến thức:** ${course.knowledgeBlock}
${course.prerequisites ? `• **Môn tiên quyết:** ${course.prerequisites}\n` : ''}
${course.description ? `• **Mô tả:** ${course.description.substring(0, 400)}${course.description.length > 400 ? '...' : ''}\n` : ''}
${course.objectives ? `• **Mục tiêu:** ${course.objectives.substring(0, 350)}${course.objectives.length > 350 ? '...' : ''}\n` : ''}`;
}

function formatCourseList(courses: CourseInfo[]): string {
  return courses
    .map((c, i) => `${i + 1}. **${c.code}** — ${c.name} (${c.totalCredits} tín chỉ)`)
    .join('\n');
}

/**
 * Build a course-aware response. If courses are found, show details.
 * Otherwise, use the intent-based fallback.
 */
function buildCourseAwareResponse(message: string, intent: string): string {
  const courses = searchCourseData(message);

  // If we found courses, always show detailed info
  if (courses.length > 0) {
    if (courses.length === 1) {
      // Single match — show full details
      return `${formatSingleCourse(courses[0])}

💡 *Thông tin từ cơ sở dữ liệu khóa học cục bộ (${getCourseCount()} môn). Để biết thêm chi tiết, hãy thử lại khi API Gemini khả dụng.*`;
    }

    // Multiple matches — show list with option to drill down
    return `🔍 Tìm thấy **${courses.length} môn học** liên quan đến câu hỏi của bạn:

${formatCourseList(courses)}

👆 Bạn muốn tìm hiểu thêm về môn nào? Hãy nhập **mã môn** hoặc **tên môn** cụ thể để xem chi tiết!

💡 *Dữ liệu từ ${getCourseCount()} môn học. Chế độ ngoại tuyến — kết nối API để có câu trả lời AI đầy đủ hơn.*`;
  }

  // No courses found — use intent-based response
  return buildIntentResponse(message, intent);
}

// ============================================================
// Intent-based fallback responses (when no courses matched)
// ============================================================

function buildIntentResponse(message: string, intent: string): string {
  switch (intent) {
    case 'greeting':
      return greetingResponse();
    case 'help':
      return helpResponse();
    case 'course_info':
      return noCourseFoundResponse(message);
    case 'course_suggestion':
      return courseSuggestionResponse();
    case 'graduation':
      return graduationResponse();
    case 'grades':
      return gradesResponse();
    case 'tuition':
      return tuitionResponse();
    case 'thanks':
      return thanksResponse();
    case 'general_academic':
      return generalAcademicResponse(message);
    default:
      return unknownResponse();
  }
}

// ============================================================
// Response templates
// ============================================================

function greetingResponse(): string {
  return `👋 Chào bạn! Tôi là trợ lý học tập của HCMUS.

Tôi có thể giúp bạn tra cứu thông tin về **${getCourseCount()}+ môn học**:

• 📖 Hỏi về môn học bất kỳ — VD: "Cấu trúc dữ liệu", "môn CSC10004", "lập trình Java"
• 📋 Gợi ý môn học cho học kỳ tới
• 🎓 Tiến độ tốt nghiệp
• 📊 Điểm số & GPA
• 💰 Học phí

Bạn cần tôi giúp gì?`;
}

function helpResponse(): string {
  return `🤖 **Những gì tôi có thể giúp bạn:**

📖 **Tra cứu môn học** — Hỏi về bất kỳ môn nào! VD:
  • "Cấu trúc dữ liệu và giải thuật"
  • "môn CSC10004"
  • "lập trình hướng đối tượng"
  • "mạng máy tính là gì"

📋 **Gợi ý môn học** — Hỏi "nên học môn nào học kỳ tới?"

🎓 **Tiến độ tốt nghiệp** — Hỏi "khi nào tôi tốt nghiệp?"

📊 **Điểm số & GPA** — Thông tin về cách tính điểm.

💰 **Học phí** — Thông tin chung về học phí và thanh toán.

⚠️ *Hiện tôi đang dùng dữ liệu khóa học cục bộ (${getCourseCount()} môn). Kết nối API Gemini để có câu trả lời AI đầy đủ hơn.*`;
}

function noCourseFoundResponse(message: string): string {
  return `⚠️ Tôi không tìm thấy môn học nào khớp với **"${message}"** trong cơ sở dữ liệu (${getCourseCount()} môn).

💡 **Gợi ý:**
• Thử nhập **mã môn** chính xác (VD: CSC10004)
• Thử nhập **tên môn** bằng tiếng Việt hoặc tiếng Anh
• Dùng từ khóa ngắn gọn (VD: "cấu trúc dữ liệu" thay vì cả câu dài)
• Hỏi "gợi ý môn học" để được tư vấn

*Chế độ ngoại tuyến — đang dùng dữ liệu khóa học cục bộ.*`;
}

function courseSuggestionResponse(): string {
  return `📋 **Gợi ý môn học**

Để gợi ý môn học phù hợp nhất, tôi cần biết:
• Ngành học của bạn
• Các môn bạn đã hoàn thành
• Học kỳ hiện tại

💡 **Mẹo chọn môn:**
• ✅ Ưu tiên môn **tiên quyết** cho các môn học sau
• ✅ Cân bằng giữa môn **đại cương** và **chuyên ngành**
• ✅ Kiểm tra **khối kiến thức** còn thiếu

Bạn cũng có thể hỏi tôi về một môn học cụ thể, VD: "Cấu trúc dữ liệu và giải thuật"

*Chế độ ngoại tuyến — kết nối API để nhận gợi ý cá nhân hóa.*`;
}

function graduationResponse(): string {
  return `🎓 **Thông tin tốt nghiệp**

Để tốt nghiệp tại HCMUS, bạn cần:
• ✅ Hoàn thành **tất cả tín chỉ** theo chương trình đào tạo (thường ~120-140 tín chỉ)
• ✅ Đạt **điểm trung bình tích lũy (GPA)** tối thiểu theo quy định
• ✅ Hoàn thành **Giáo dục thể chất** và **Giáo dục quốc phòng**
• ✅ Đạt chuẩn **ngoại ngữ** đầu ra
• ✅ Hoàn thành **khóa luận tốt nghiệp** hoặc các môn thay thế

Để kiểm tra tiến độ chính xác, truy cập trang **Grades** trong portal.

*Chế độ ngoại tuyến — thử lại khi API khả dụng để được tư vấn chi tiết.*`;
}

function gradesResponse(): string {
  return `📊 **Thông tin về điểm số & GPA**

**Thang điểm HCMUS:**
• A+ (9.0-10.0), A (8.5-8.9), B+ (8.0-8.4), B (7.0-7.9)
• C+ (6.0-6.9), C (5.5-5.9), D+ (5.0-5.4), D (4.0-4.9), F (<4.0)

**Cách tính GPA:**
• GPA = Tổng (Điểm × Số tín chỉ) / Tổng số tín chỉ
• GPA tích lũy: tính trên tất cả các môn đã học

Xem điểm chi tiết tại trang **Grades** trong portal.

*Chế độ ngoại tuyến — đang dùng thông tin chung.*`;
}

function tuitionResponse(): string {
  return `💰 **Thông tin học phí**

Học phí tại HCMUS được tính dựa trên:
• **Số tín chỉ đăng ký** trong học kỳ
• **Đơn giá tín chỉ** theo ngành học và hệ đào tạo
• Các khoản **phí dịch vụ** khác (nếu có)

Để xem thông tin học phí chi tiết:
• Truy cập trang **Tuition** trong portal
• Kiểm tra số dư và các khoản thanh toán

*Chế độ ngoại tuyến — kiểm tra trang Tuition để biết số liệu chính xác.*`;
}

function generalAcademicResponse(message: string): string {
  return `🤔 Cảm ơn câu hỏi của bạn! Tôi không tìm thấy môn học cụ thể nào khớp với **"${message}"**.

💡 Bạn có thể thử:
• 📖 Hỏi về một **môn học cụ thể** (VD: "Cấu trúc dữ liệu", "CSC10004")
• 📋 **Gợi ý môn học** cho học kỳ tới
• 🎓 Thông tin về **tốt nghiệp**

*Chế độ ngoại tuyến — giới hạn trong dữ liệu khóa học cục bộ (${getCourseCount()} môn).*`;
}

function thanksResponse(): string {
  return 'Không có gì! 😊 Rất vui được giúp bạn. Cứ hỏi tôi nếu cần thêm thông tin về môn học nhé!';
}

function unknownResponse(): string {
  return `Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể thử:
• 📖 Hỏi về một **môn học cụ thể** (VD: "Cấu trúc dữ liệu", "môn CSC10004")
• 📋 **Gợi ý môn học** cho học kỳ tới
• 🎓 Thông tin về **tốt nghiệp**
• 💰 Thông tin về **học phí**

*Chế độ ngoại tuyến — có thể tra cứu ${getCourseCount()}+ môn học.*`;
}

// ============================================================
// Main entry point
// ============================================================

/**
 * Generate a response locally without calling any external API.
 * ALWAYS searches the course database first — if courses match,
 * shows detailed info. Falls back to intent-based responses
 * only when no courses are found.
 */
export function generateLocalResponse(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return 'Bạn có thể nhập câu hỏi về môn học, học phí, điểm số... Tôi sẽ cố gắng giúp bạn!';
  }

  const { intent } = detectIntent(trimmed);

  // Always try course-aware response first
  return buildCourseAwareResponse(trimmed, intent);
}
