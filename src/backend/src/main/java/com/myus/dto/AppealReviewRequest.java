package com.myus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Request DTO for an administrator reviewing/processing a grade appeal.
 *
 * <p>Allows the administrator to update the appeal status,
 * add reviewer comments, and optionally set a fee payment deadline.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppealReviewRequest {

    /**
     * The new status for the appeal.
     * Must be one of: "Under Review", "Approved", "Denied".
     */
    @NotBlank(message = "Status is required.")
    @Pattern(
            regexp = "^(Under Review|Approved|Denied)$",
            message = "Status must be one of: 'Under Review', 'Approved', 'Denied'."
    )
    private String status;

    /**
     * Optional comments from the reviewing administrator.
     */
    @Size(max = 2000, message = "Reviewer comments must not exceed 2000 characters.")
    private String reviewerComments;

    /**
     * Optional fee payment deadline set by the administrator
     * when the appeal is approved or moved to processing.
     */
    private LocalDateTime deadline;
}
