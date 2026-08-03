package com.myus.service.ai.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myus.config.ai.AiConfig.GeminiProperties;
import com.myus.dto.ai.*;
import com.myus.entity.Student;
import com.myus.service.ai.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Core chatbot service combining rule-based degree audit with
 * Google Gemini LLM for conversational responses.
 *
 * <p>If the Gemini API is unavailable (timeout, missing key), the service
 * gracefully falls back to structured rule-based responses.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    private final ProfileAnalysisService profileAnalysisService;
    private final CourseRecommendationService courseRecommendationService;
    private final GraduationTrackingService graduationTrackingService;
    private final WebClient geminiWebClient;
    private final GeminiProperties geminiProps;
    private final ObjectMapper objectMapper;

    @Override
    public ChatResponseDTO processChat(Student student, ChatRequestDTO request) {
        String contextType = request.getContextType() != null
                ? request.getContextType().name()
                : "GENERAL";

        log.info("Processing chat for student={}, contextType={}", student.getUsername(), contextType);

        // 1. Gather rule-based data
        GraduationProgressDTO progress = profileAnalysisService.getGraduationProgress(student);
        List<CourseSuggestionDTO> recommendations = courseRecommendationService.recommendCourses(student);

        // 2. Try Gemini LLM, fall back to rules engine
        String replyText;
        try {
            replyText = callGemini(student, request.getMessage(), contextType, progress, recommendations);
        } catch (Exception e) {
            log.warn("Gemini API unavailable, falling back to rule-based response: {}", e.getMessage());
            replyText = buildFallbackResponse(student, contextType, progress, recommendations);
        }

        return ChatResponseDTO.builder()
                .responseId(UUID.randomUUID().toString())
                .replyText(replyText)
                .timestamp(LocalDateTime.now())
                .suggestedCourses(contextType.equals("COURSE_SUGGESTION") ? recommendations : null)
                .graduationProgress(contextType.equals("GRADUATION_AUDIT") ? progress : null)
                .intent(contextType)
                .build();
    }

    /**
     * Call the Google Gemini API with a contextual prompt.
     */
    private String callGemini(Student student, String userMessage, String contextType,
                              GraduationProgressDTO progress, List<CourseSuggestionDTO> recommendations) {
        String apiKey = geminiProps.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }

        String model = geminiProps.getModel();
        String url = "/models/" + model + ":generateContent?key=" + apiKey;

        // Build the prompt with RAG context
        String systemContext = buildSystemContext(student, progress, recommendations);
        String fullPrompt = systemContext + "\n\nStudent question: " + userMessage
                + "\n\nRespond in a friendly, helpful tone as an academic advisor. "
                + "If the student is asking about course recommendations, list specific courses. "
                + "If asking about graduation, provide concrete numbers about their progress.";

        Map<String, Object> requestBody = new LinkedHashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new LinkedHashMap<>();
        List<Map<String, Object>> parts = new ArrayList<>();
        Map<String, Object> part = new LinkedHashMap<>();
        part.put("text", fullPrompt);
        parts.add(part);
        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);

        // Generation config
        Map<String, Object> generationConfig = new LinkedHashMap<>();
        generationConfig.put("temperature", geminiProps.getTemperature());
        generationConfig.put("maxOutputTokens", geminiProps.getMaxTokens());
        requestBody.put("generationConfig", generationConfig);

        String response = geminiWebClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(geminiProps.getTimeoutSeconds()))
                .onErrorResume(e -> {
                    log.error("Gemini API error: {}", e.getMessage());
                    return Mono.empty();
                })
                .block();

        if (response == null) {
            throw new RuntimeException("Empty response from Gemini API");
        }

        return extractTextFromGeminiResponse(response);
    }

    /**
     * Build a RAG context prompt with the student's academic data.
     */
    private String buildSystemContext(Student student, GraduationProgressDTO progress,
                                      List<CourseSuggestionDTO> recommendations) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an AI academic advisor for MyUS University. ");
        sb.append("You are helping a student named ").append(student.getFirstName())
                .append(" ").append(student.getLastName()).append(". ");
        sb.append("Major: ").append(student.getMajor() != null ? student.getMajor() : "Undeclared").append(". ");
        sb.append("Current academic standing: ")
                .append(student.getEnrollmentStatus() != null ? student.getEnrollmentStatus() : "Active")
                .append(". ");

        sb.append("\n\n--- Academic Progress ---\n");
        sb.append("Completed credits: ").append(progress.getCompletedCredits())
                .append(" / ").append(progress.getTotalRequiredCredits()).append("\n");
        sb.append("Remaining credits: ").append(progress.getRemainingCredits()).append("\n");
        sb.append("Estimated semesters left: ").append(progress.getEstimatedSemestersLeft()).append("\n");
        sb.append("Completion: ").append(progress.getCompletionPercentage()).append("%\n");

        if (recommendations != null && !recommendations.isEmpty()) {
            sb.append("\n--- Recommended Courses ---\n");
            for (CourseSuggestionDTO rec : recommendations.stream().limit(5).toList()) {
                sb.append("- ").append(rec.getCourseCode()).append(": ").append(rec.getCourseName())
                        .append(" (").append(rec.getCredits()).append(" credits)")
                        .append(" [Prerequisites: ").append(rec.isPrerequisiteCleared() ? "MET" : "MISSING")
                        .append("]\n");
            }
            if (recommendations.size() > 5) {
                sb.append("- ... and ").append(recommendations.size() - 5).append(" more\n");
            }
        }

        return sb.toString();
    }

    /**
     * Extract the text content from Gemini API JSON response.
     */
    private String extractTextFromGeminiResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText("I'm sorry, I couldn't process that request.");
                }
            }
            // Check for error response
            JsonNode error = root.path("error");
            if (!error.isMissingNode()) {
                log.error("Gemini API error: {}", error.path("message").asText());
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
        }
        return "I apologize, but I had trouble generating a response. Please try again.";
    }

    /**
     * Rule-based fallback when Gemini is unavailable.
     */
    private String buildFallbackResponse(Student student, String contextType,
                                         GraduationProgressDTO progress,
                                         List<CourseSuggestionDTO> recommendations) {
        return switch (contextType) {
            case "COURSE_SUGGESTION" -> buildCourseRecommendationFallback(recommendations);
            case "GRADUATION_AUDIT" -> buildGraduationFallback(student, progress);
            default -> buildGeneralFallback(student, progress);
        };
    }

    private String buildCourseRecommendationFallback(List<CourseSuggestionDTO> recommendations) {
        if (recommendations.isEmpty()) {
            return "📚 You've completed all available courses in the catalog. Great job! "
                    + "Check back next semester for new course offerings.";
        }
        StringBuilder sb = new StringBuilder("📚 **Here are your recommended courses for next semester:**\n\n");
        int count = 0;
        for (CourseSuggestionDTO rec : recommendations) {
            if (count >= 5) break;
            String emoji = rec.isPrerequisiteCleared() ? "✅" : "⚠️";
            sb.append(count + 1).append(". ").append(emoji).append(" **")
                    .append(rec.getCourseCode()).append("** — ").append(rec.getCourseName())
                    .append(" (").append(rec.getCredits()).append(" credits)\n")
                    .append("   > ").append(rec.getReasonForRecommendation()).append("\n\n");
            count++;
        }
        sb.append("\n💡 _These recommendations are based on your completed courses and prerequisite eligibility._");
        return sb.toString();
    }

    private String buildGraduationFallback(Student student, GraduationProgressDTO progress) {
        return "🎓 **Your Graduation Progress**\n\n"
                + "📊 Credits: **" + progress.getCompletedCredits() + " / "
                + progress.getTotalRequiredCredits() + "** ("
                + String.format("%.1f", progress.getCompletionPercentage()) + "%)\n\n"
                + "📅 Estimated semesters remaining: **" + progress.getEstimatedSemestersLeft() + "**\n"
                + "📝 Remaining credits: **" + progress.getRemainingCredits() + "**\n\n"
                + "⚠️ **Key Milestones:**\n"
                + String.join("\n", progress.getCriticalMilestonesPending().stream()
                        .map(m -> "  • " + m).toList())
                + "\n\n💡 _Keep up the great work, " + student.getFirstName() + "!_";
    }

    private String buildGeneralFallback(Student student, GraduationProgressDTO progress) {
        return "👋 Hello " + student.getFirstName() + "! I'm your AI academic advisor.\n\n"
                + "I can help you with:\n"
                + "📚 **Course recommendations** — find the best courses for your next semester\n"
                + "🎓 **Graduation tracking** — check your progress and estimated timeline\n"
                + "❓ **Academic questions** — ask about prerequisites, requirements, or policies\n\n"
                + "You've completed **" + progress.getCompletedCredits() + " credits** so far "
                + "(" + String.format("%.1f", progress.getCompletionPercentage()) + "% toward graduation).\n\n"
                + "What would you like help with today?";
    }
}
