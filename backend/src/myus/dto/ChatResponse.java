package myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for a chat message from the AI Chatbot.
 * Contains the conversational reply text and optional
 * structured recommendation or progress data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private String responseId;
    private String replyText;
    private String timestamp;
    private List<CourseSuggestionDTO> suggestedCourses;
    private GraduationProgressDTO graduationProgress;
}
