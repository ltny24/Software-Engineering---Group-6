package myus.controller;

import myus.dto.ChatRequest;
import myus.dto.ChatResponse;
import myus.dto.CourseSuggestionDTO;
import myus.dto.GraduationProgressDTO;
import myus.security.IsStudent;
import myus.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * REST controller for the AI Learning Path Chatbot.
 *
 * <p>All endpoints require the {@code STUDENT} role. The authenticated
 * student is resolved from the JWT token via {@link Principal}.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code POST /api/v1/chatbot/chat}           – send a message to the chatbot</li>
 *   <li>{@code GET  /api/v1/chatbot/recommendations} – get course recommendations</li>
 *   <li>{@code GET  /api/v1/chatbot/progress}        – get graduation progress</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    /**
     * Process a natural language chat message and return an AI-style response
     * with optional structured recommendation or progress data.
     *
     * @param principal the authenticated student principal
     * @param request   the chat message payload
     * @return the chatbot response
     */
    @PostMapping("/chat")
    @IsStudent
    public ResponseEntity<ChatResponse> chat(
            Principal principal,
            @Valid @RequestBody ChatRequest request) {

        String username = principal.getName();
        log.debug("POST /api/v1/chatbot/chat – username={}, contextType={}",
                username, request.getContextType());

        ChatResponse response = chatbotService.chat(username, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve recommended courses for the authenticated student's next semester.
     *
     * @param principal the authenticated student principal
     * @return list of course suggestions with prerequisite status
     */
    @GetMapping("/recommendations")
    @IsStudent
    public ResponseEntity<List<CourseSuggestionDTO>> getRecommendations(
            Principal principal) {

        String username = principal.getName();
        log.debug("GET /api/v1/chatbot/recommendations – username={}", username);

        List<CourseSuggestionDTO> recommendations = chatbotService.getRecommendations(username);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Retrieve the authenticated student's graduation progress and degree audit.
     *
     * @param principal the authenticated student principal
     * @return graduation progress summary
     */
    @GetMapping("/progress")
    @IsStudent
    public ResponseEntity<GraduationProgressDTO> getProgress(
            Principal principal) {

        String username = principal.getName();
        log.debug("GET /api/v1/chatbot/progress – username={}", username);

        GraduationProgressDTO progress = chatbotService.getProgress(username);
        return ResponseEntity.ok(progress);
    }
}
