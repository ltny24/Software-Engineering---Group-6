package com.myus.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for submitting a new grade appeal.
 *
 * <p>The student provides the grade they wish to appeal,
 * a reason for the appeal, and an optional URL to supporting documentation.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppealSubmitRequest {

    /**
     * The ID of the grade being appealed. Must reference a grade
     * that belongs to the authenticated student.
     */
    @NotNull(message = "Grade ID is required.")
    private Long gradeId;

    /**
     * The reason for the appeal. Must be between 10 and 2000 characters.
     */
    @NotBlank(message = "Appeal reason is required.")
    @Size(min = 10, max = 2000, message = "Appeal reason must be between 10 and 2000 characters.")
    private String appealReason;

    /**
     * Optional URL to a supporting document (e.g., scanned exam paper, evidence).
     */
    @Size(max = 2048, message = "Supporting document URL must not exceed 2048 characters.")
    private String supportingDocumentUrl;
}
