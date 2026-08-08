package com.myus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Data Transfer Object for Evaluation Survey details and student status")
public class SurveyDto {

    @Schema(description = "Survey ID", example = "1")
    private Long surveyId;

    @Schema(description = "Survey Title", example = "End of Semester Evaluation - Intro to Computer Science")
    private String title;

    @Schema(description = "Survey Description", example = "Please evaluate your experience in this course.")
    private String description;

    @Schema(description = "Opening date of the survey")
    private LocalDateTime openDate;

    @Schema(description = "Closing date/deadline of the survey")
    private LocalDateTime closeDate;

    @Schema(description = "Status of the survey for the current student (Pending, Completed, Closed)", example = "Pending")
    private String status;

    @Schema(description = "If completed, the JSON string of the student's previous answers", example = "{\"content\":4, \"delivery\":5, \"materials\":4, \"facilities\":5, \"comments\":\"Great!\"}")
    private String submittedAnswers;

    @Schema(description = "If completed, the timestamp of submission")
    private LocalDateTime submittedAt;
}
