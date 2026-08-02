package myus.service;

import myus.dto.ChatRequest;
import myus.dto.ChatResponse;
import myus.dto.CourseSuggestionDTO;
import myus.dto.GraduationProgressDTO;

import java.util.List;

/**
 * Service contract for the AI Learning Path Chatbot.
 *
 * <p>Provides conversational academic counseling including
 * course recommendations, graduation progress tracking,
 * and prerequisite eligibility analysis.</p>
 */
public interface ChatbotService {

    /**
     * Process a chat message and return a conversational response.
     * Automatically detects intent (course suggestion, graduation audit, general)
     * and populates structured response data accordingly.
     *
     * @param username  the authenticated student's username
     * @param request   the chat message request
     * @return the chatbot response with text and optional structured data
     */
    ChatResponse chat(String username, ChatRequest request);

    /**
     * Get recommended courses for the next semester based on
     * the student's academic profile and completed prerequisites.
     *
     * @param username the authenticated student's username
     * @return list of course suggestions with prerequisite status
     */
    List<CourseSuggestionDTO> getRecommendations(String username);

    /**
     * Get the student's degree audit and graduation progress.
     *
     * @param username the authenticated student's username
     * @return graduation progress summary
     */
    GraduationProgressDTO getProgress(String username);
}
