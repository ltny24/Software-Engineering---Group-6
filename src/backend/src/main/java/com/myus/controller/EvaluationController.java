package com.myus.controller;

import com.myus.dto.SurveyDto;
import com.myus.dto.SurveyResponseRequest;
import com.myus.service.EvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/evaluations")
@RequiredArgsConstructor
@Tag(name = "Evaluations", description = "Endpoints for student evaluation surveys (UC-09)")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @Operation(summary = "Get all evaluation surveys for the current student")
    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<SurveyDto>> getSurveys(Principal principal) {
        return ResponseEntity.ok(evaluationService.getSurveysForStudent(principal.getName()));
    }

    @Operation(summary = "Get details of a specific evaluation survey")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SurveyDto> getSurveyById(Principal principal, @PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getSurveyById(principal.getName(), id));
    }

    @Operation(summary = "Submit a response for an evaluation survey")
    @PostMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SurveyDto> submitSurvey(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody SurveyResponseRequest request) {
        return ResponseEntity.ok(evaluationService.submitSurvey(principal.getName(), id, request));
    }
}
