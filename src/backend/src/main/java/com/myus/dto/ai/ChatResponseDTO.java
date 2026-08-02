package com.myus.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for AI chatbot responses returned to the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {

    private String responseId;
    private String replyText;
    private LocalDateTime timestamp;
    private List<CourseSuggestionDTO> suggestedCourses;
    private GraduationProgressDTO graduationProgress;
    private String intent; // "COURSE_SUGGESTION", "GRADUATION_AUDIT", "GENERAL"
}
