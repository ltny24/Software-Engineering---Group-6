package myus.config;

import myus.entity.Administrator;
import myus.entity.FAQArticle;
import myus.entity.Student;
import myus.entity.UserRole;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Profile("dev")
public class DevDataInitializer implements CommandLineRunner {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public void run(String... args) {
        Administrator admin = new Administrator();
        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setRole(UserRole.ADMINISTRATOR);
        admin.setEmail("admin@myus.edu.vn");
        admin.setDisplayName("Admin User");
        admin.setDepartment("Academic Affairs");
        em.persist(admin);

        Student student = new Student();
        student.setUsername("student");
        student.setPassword("student");
        student.setRole(UserRole.STUDENT);
        student.setFirstName("Test");
        student.setLastName("User");
        student.setEmail("student@myus.edu.vn");
        student.setStudentType("Regular");
        student.setMajor("Software Engineering");
        student.setEnrollmentStatus("Enrolled");
        student.setRegistrationStatus("Active");
        em.persist(student);

        // ── Seed FAQ Articles ───────────────────────────────────
        seedFAQ("How to register for courses online?",
                "To register for courses, navigate to the Courses page from the sidebar. "
                + "Browse the course catalog, apply filters by department and term, "
                + "and click 'Register' on any available course. You can view your "
                + "enrolled courses in the 'My Registrations' tab. "
                + "Make sure you have completed all prerequisites before registering.",
                "Course Registration", "courses, registration, enrollment, how-to");

        seedFAQ("How to appeal a course grade?",
                "To appeal a grade, go to the Grades page and click 'Request Appeal' "
                + "next to the course you wish to contest. You must submit your appeal "
                + "within 14 calendar days from the grade publication date. "
                + "Fill in the appeal form with your expected grade, reason for appeal, "
                + "and any supporting documents (PDF, JPG, PNG up to 5MB each). "
                + "After submission, pay the appeal fee at the Academic Affairs Office "
                + "within 5 business days.",
                "Grade Appeals", "appeal, grade, review, re-evaluation");

        seedFAQ("What is the process for paying tuition online?",
                "Tuition payments can be viewed on the Tuition page. The page shows "
                + "your total charges, any scholarship deductions, amount paid, "
                + "and remaining balance. Currently, payments are processed at the "
                + "university finance office. The Tuition page provides a payment "
                + "history table with transaction references, dates, methods, "
                + "amounts, and statuses for your records.",
                "Finance", "tuition, payment, finance, fees");

        seedFAQ("How is my GPA calculated?",
                "Your GPA is calculated on two scales:\n"
                + "• 10-point scale: Direct average of your course scores weighted by credits\n"
                + "• 4-point scale: Converted from the 10-point scale using standard mapping\n\n"
                + "You can view your GPA for each term on the Grades page. "
                + "The summary cards show cumulative GPA on both scales, "
                + "and the grade table shows individual course scores.",
                "Grades & GPA", "GPA, grade point, calculation, academic standing");

        seedFAQ("How do I use the AI Chatbot for course recommendations?",
                "The AI Learning Path Chatbot is available on the Support page. "
                + "Click the 'AI Chatbot' tab and start a conversation. "
                + "You can ask questions like:\n"
                + "• 'Suggest courses for next semester'\n"
                + "• 'Check my graduation progress'\n"
                + "• 'Am I eligible for CSC10009?'\n\n"
                + "The chatbot analyzes your transcript and curriculum requirements "
                + "to provide personalized recommendations.",
                "Support & Chatbot", "chatbot, AI, recommendations, support");

        seedFAQ("What are the prerequisite requirements for courses?",
                "Prerequisites are courses you must complete before enrolling in "
                + "advanced subjects. Each course listing shows its prerequisites. "
                + "When you browse courses, the system checks your academic history "
                + "to determine eligibility. The AI Chatbot can also analyze your "
                + "transcript and recommend courses you are eligible to take.",
                "Course Registration", "prerequisites, requirements, eligibility");

        seedFAQ("How do I check my graduation progress?",
                "You can check your graduation progress in two ways:\n"
                + "1. Ask the AI Chatbot 'Check my graduation progress' on the Support page\n"
                + "2. View your completed credits and GPA on the Grades page\n\n"
                + "The chatbot provides a detailed breakdown including total required "
                + "credits, completed credits, remaining credits, estimated semesters "
                + "left, and critical milestones you need to complete.",
                "Graduation", "graduation, progress, credits, timeline, degree audit");

        seedFAQ("What should I do if I cannot login to my account?",
                "If you cannot login, check the following:\n"
                + "1. Make sure you are using the correct username and password\n"
                + "2. Check that Caps Lock is not enabled\n"
                + "3. Clear your browser cache and cookies\n\n"
                + "If you still cannot access your account, contact the Academic Affairs "
                + "Office during working hours for assistance with account recovery.",
                "Account & Access", "login, account, password, access, authentication");

        seedFAQ("How are tuition fees calculated?",
                "Tuition fees are calculated per credit hour based on your program. "
                + "The total charges for each term appear on your Tuition page, "
                + "along with any scholarship or discount deductions. "
                + "Additional fees may apply for:\n"
                + "• Grade appeals (50,000 VND re-evaluation fee)\n"
                + "• Late registration\n"
                + "• Special examination requests\n\n"
                + "Check the Tuition page for your current balance and payment history.",
                "Finance", "tuition, fees, charges, scholarships, costs");

        seedFAQ("What are the important academic deadlines I should know?",
                "Key academic deadlines include:\n"
                + "• Course Registration: First 2 weeks of each semester\n"
                + "• Course Drop: Within 4 weeks of semester start\n"
                + "• Grade Appeal Submission: Within 14 days of grade publication\n"
                + "• Appeal Fee Payment: Within 5 business days of appeal submission\n"
                + "• Tuition Payment: By the deadline shown on your Tuition page\n\n"
                + "Always check the portal regularly for announcements and deadline updates.",
                "Academic Policies", "deadlines, dates, registration, appeal, payment");
    }

    private void seedFAQ(String question, String answer, String category, String tags) {
        FAQArticle faq = new FAQArticle();
        faq.setQuestion(question);
        faq.setAnswer(answer);
        faq.setCategory(category);
        faq.setTags(tags);
        faq.setUpdatedAt(LocalDateTime.now());
        faq.setPublished(true);
        em.persist(faq);
    }
}
