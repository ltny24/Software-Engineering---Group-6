package myus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for sending a chat message to the AI Chatbot.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @NotBlank(message = "Message is required.")
    @Size(min = 1, max = 2000, message = "Message must be between 1 and 2000 characters.")
    private String message;

    /**
     * Context type hint for the chatbot.
     * Values: "GENERAL", "COURSE_SUGGESTION", "GRADUATION_AUDIT"
     */
    private String contextType;
}
