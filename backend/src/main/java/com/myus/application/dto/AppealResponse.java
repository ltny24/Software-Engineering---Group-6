package com.myus.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO representing a grade appeal with all relevant details.
 *
 * <p>Includes denormalized grade and course information so that
 * the frontend can display a complete appeal record without
 * additional API calls.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppealResponse {

    private Long appealId;

    private Long studentId;

    private String studentName;

    private Long gradeId;

    private String courseCode;

    private String courseName;

    private String gradeValue;

    private LocalDateTime submittedAt;

    private String status;

    private String appealReason;

    private String supportingDocumentUrl;

    private String reviewerComments;

    private LocalDateTime deadline;

    private LocalDateTime resolvedAt;

    private String resolutionCode;
}
