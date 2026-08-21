package com.myus.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for incoming chat messages from the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDTO {

    private String message;

    public enum ContextType {
        GENERAL,
        COURSE_SUGGESTION,
        GRADUATION_AUDIT
    }

    private ContextType contextType;
}
