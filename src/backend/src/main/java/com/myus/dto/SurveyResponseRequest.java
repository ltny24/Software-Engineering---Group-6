package com.myus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "Payload for submitting an evaluation survey")
public class SurveyResponseRequest {

    @Schema(description = "Dynamic map of responses", example = "{\"q1\": 5, \"q2\": 4}")
    private Map<String, Object> responses;

    @Schema(description = "Optional open-text comments", example = "The lecturer was great but the room was too cold.")
    private String comments;
}
