package myus.service;

import myus.dto.ChatRequest;
import myus.dto.ChatResponse;
import myus.dto.CourseSuggestionDTO;
import myus.dto.GraduationProgressDTO;
import myus.entity.Student;
import myus.exception.ResourceNotFoundException;
import myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Rule-based implementation of {@link ChatbotService}.
 *
 * <p>Provides academic counseling using keyword-based intent detection
 * and structured mock data. Designed to work without external LLM
 * dependencies. The responses simulate AI conversational patterns
 * while the underlying recommendation logic uses deterministic rules.</p>
 *
 * <p><b>Intent Detection Keywords:</b></p>
 * <ul>
 *   <li>COURSE_SUGGESTION – "suggest", "recommend", "next semester", "register", "course"</li>
 *   <li>GRADUATION_AUDIT – "graduate", "progress", "credits", "timeline", "when"</li>
 *   <li>GENERAL – everything else</li>
 * </ul>
 */
@Slf4j
@Service
@Transactional
public class ChatbotServiceImpl implements ChatbotService {

    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final StudentRepository studentRepository;

    public ChatbotServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ── Chat ────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public ChatResponse chat(String username, ChatRequest request) {
        Student student = findStudent(username);
        String message = request.getMessage().toLowerCase().trim();
        String contextType = request.getContextType() != null
                ? request.getContextType() : detectIntent(message);

        String responseId = "resp-" + UUID.randomUUID().toString().substring(0, 8);
        String timestamp = LocalDateTime.now().format(TS_FMT);

        ChatResponse response = new ChatResponse();
        response.setResponseId(responseId);
        response.setTimestamp(timestamp);

        switch (contextType) {
            case "COURSE_SUGGESTION":
                response.setReplyText(buildCourseSuggestionReply(student));
                response.setSuggestedCourses(buildMockRecommendations(student));
                break;
            case "GRADUATION_AUDIT":
                GraduationProgressDTO progress = buildMockProgress(student);
                response.setReplyText(buildProgressReply(student, progress));
                response.setGraduationProgress(progress);
                break;
            default:
                response.setReplyText(buildGeneralReply(student, message));
                break;
        }

        log.debug("Chat response generated: responseId={}, intent={}, username={}",
                responseId, contextType, username);
        return response;
    }

    // ── Recommendations ─────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<CourseSuggestionDTO> getRecommendations(String username) {
        Student student = findStudent(username);
        return buildMockRecommendations(student);
    }

    // ── Progress ────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public GraduationProgressDTO getProgress(String username) {
        Student student = findStudent(username);
        return buildMockProgress(student);
    }

    // ── Intent Detection ────────────────────────────────────────

    /**
     * Detects the user's intent from the message content using keyword matching.
     */
    private String detectIntent(String message) {
        if (containsAny(message, "suggest", "recommend", "next semester",
                "what course", "which course", "register for", "enroll")) {
            return "COURSE_SUGGESTION";
        }
        if (containsAny(message, "graduate", "graduation", "progress", "credits left",
                "timeline", "when will i", "how long", "degree audit", "remaining")) {
            return "GRADUATION_AUDIT";
        }
        return "GENERAL";
    }

    private boolean containsAny(String message, String... keywords) {
        for (String kw : keywords) {
            if (message.contains(kw)) return true;
        }
        return false;
    }

    // ── Reply Builders ──────────────────────────────────────────

    private String buildCourseSuggestionReply(Student student) {
        String name = student.getFirstName() != null ? student.getFirstName() : "there";
        return "Hello " + name + "! 👋 I have analyzed your academic transcript "
                + "and curriculum requirements for your major in **" + safe(student.getMajor())
                + "**. Here are my top course recommendations for your next semester. "
                + "These suggestions prioritize mandatory core courses and subjects "
                + "that unlock future requirements. Each card shows whether you have "
                + "cleared the prerequisites. You can save courses to your wishlist for "
                + "future enrollment planning.";
    }

    private String buildProgressReply(Student student, GraduationProgressDTO p) {
        String name = student.getFirstName() != null ? student.getFirstName() : "there";
        return "Here is your graduation progress summary, " + name + "! 📊\n\n"
                + "You have completed **" + p.getCompletedCredits() + " out of "
                + p.getTotalRequiredCredits() + "** required credits (**"
                + String.format("%.1f", p.getCompletionPercentage()) + "%**).\n\n"
                + "At your current pace, you have approximately **"
                + String.format("%.1f", p.getEstimatedSemestersLeft())
                + " semesters** remaining, with an estimated graduation around **"
                + safe(p.getEstimatedGraduationDate()) + "**.\n\n"
                + "Remember to complete all outstanding milestones before graduation. "
                + "I am here to help you plan each semester!";
    }

    private String buildGeneralReply(Student student, String message) {
        String name = student.getFirstName() != null ? student.getFirstName() : "there";
        if (containsAny(message, "hello", "hi", "hey", "good morning", "good afternoon")) {
            return "Hello " + name + "! 👋 I am your MyUS Academic Assistant. "
                    + "I can help you with:\n\n"
                    + "📚 **Course Recommendations** – suggest courses for your next semester\n"
                    + "📊 **Graduation Progress** – check your degree audit and timeline\n"
                    + "📝 **Academic Policies** – ask about grades, appeals, and regulations\n\n"
                    + "What would you like to know about?";
        }
        if (containsAny(message, "thank", "thanks", "appreciate")) {
            return "You are welcome, " + name + "! 😊 I am happy to help. "
                    + "Feel free to ask if you need anything else about your academic journey.";
        }
        if (containsAny(message, "prerequisite", "pre requisite", "required for")) {
            return "Prerequisites are courses you must complete before enrolling in "
                    + "advanced subjects. Each course in the catalog lists its prerequisites. "
                    + "When I recommend courses, I check your transcript to ensure you "
                    + "have completed all prerequisites. A ✅ green badge means the "
                    + "prerequisite is cleared; ⚠️ yellow means it is still pending.\n\n"
                    + "Would you like me to suggest courses you are eligible for next semester?";
        }
        if (containsAny(message, "gpa", "grade point", "academic standing")) {
            return "Your GPA (Grade Point Average) is calculated on both 10-point and "
                    + "4-point scales based on your course grades. You can view your "
                    + "detailed grades and GPA on the **Grades** page.\n\n"
                    + "To check your graduation progress and see how many credits remain, "
                    + "try asking me: \"What is my graduation progress?\"";
        }
        if (containsAny(message, "appeal", "grade appeal", "review")) {
            return "The grade appeal process allows you to request a re-evaluation of "
                    + "an exam or assignment grade. Here is how it works:\n\n"
                    + "1. Go to the **Appeals** section from the sidebar\n"
                    + "2. Select the course and exam type you want to appeal\n"
                    + "3. Submit your appeal with supporting evidence within 14 days of grade publication\n"
                    + "4. Pay the appeal fee at the Academic Affairs Office within 5 business days\n"
                    + "5. Track your appeal status on the Appeals dashboard\n\n"
                    + "Would you like more details about any of these steps?";
        }
        return "Thank you for your question, " + name + "! I am here to help with "
                + "course recommendations, graduation planning, prerequisite checks, "
                + "and academic policies.\n\n"
                + "Try asking me:\n"
                + "- 'Suggest courses for next semester'\n"
                + "- 'Check my graduation progress'\n"
                + "- 'How do grade appeals work?'\n\n"
                + "Or type your specific question and I will do my best to assist!";
    }

    // ── Mock Data Builders ──────────────────────────────────────

    private List<CourseSuggestionDTO> buildMockRecommendations(Student student) {
        List<CourseSuggestionDTO> suggestions = new ArrayList<>();

        suggestions.add(new CourseSuggestionDTO(
                2001L, "CSC10009", "Computer Systems",
                4, true,
                "Core course for your major – unlocks Operating Systems and Networks next semester.",
                "Mon/Wed 09:00 - 10:30", "Dr. Nguyễn Văn A"));

        suggestions.add(new CourseSuggestionDTO(
                2002L, "MATH230", "Linear Algebra",
                4, true,
                "Required foundation for advanced algorithm courses and AI/ML electives.",
                "Tue/Thu 11:00 - 12:30", "Thầy Trần Văn B"));

        suggestions.add(new CourseSuggestionDTO(
                2003L, "CS202", "Database Systems",
                3, true,
                "Essential for software engineering – highly recommended this term before the project course.",
                "Mon/Wed 13:00 - 14:30", "Cô Lê Thị C"));

        suggestions.add(new CourseSuggestionDTO(
                2004L, "CS301", "Artificial Intelligence",
                4, false,
                "Important elective – but you must complete MATH230 (Linear Algebra) first.",
                "Tue/Thu 15:00 - 16:30", "Dr. Phạm Văn D"));

        return suggestions;
    }

    private GraduationProgressDTO buildMockProgress(Student student) {
        GraduationProgressDTO progress = new GraduationProgressDTO();
        progress.setTotalRequiredCredits(135);
        progress.setCompletedCredits(85);
        progress.setRemainingCredits(50);
        progress.setCompletionPercentage((85.0 / 135.0) * 100.0);
        progress.setEstimatedSemestersLeft(3.5);

        List<String> milestones = new ArrayList<>();
        milestones.add("TOEIC 800+ required before Year 3 Semester 2");
        milestones.add("Graduation internship (6 credits) required in final year");
        milestones.add("Complete at least 12 elective credits from approved list");
        progress.setCriticalMilestonesPending(milestones);

        progress.setEstimatedGraduationDate("December 2027");
        return progress;
    }

    // ── Helpers ─────────────────────────────────────────────────

    private Student findStudent(String username) {
        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));
    }

    private String safe(String value) {
        return value != null ? value : "N/A";
    }
}
