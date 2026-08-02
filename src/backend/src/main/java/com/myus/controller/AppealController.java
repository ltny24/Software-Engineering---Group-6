package com.myus.controller;

import com.myus.dto.AppealResponse;
import com.myus.dto.AppealSubmitRequest;
import com.myus.security.IsStudent;
import com.myus.service.AppealService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import myus.dto.appeal.AppealDetailResponse;
import myus.dto.appeal.AppealSummaryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * REST controller for student grade appeal operations.
 *
 * <p>All endpoints require the {@code STUDENT} role via the
 * {@link IsStudent} annotation. The authenticated student is
 * resolved from the JWT token.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/appeals")
public class AppealController {

    private final AppealService appealService;

    public AppealController(AppealService appealService) {
        this.appealService = appealService;
    }

    /**
     * Submit a new grade appeal.
     */
    @PostMapping
    @IsStudent
    public ResponseEntity<AppealResponse> submitAppeal(
            Principal principal,
            @Valid @RequestBody AppealSubmitRequest request) {

        String username = principal.getName();
        log.debug("POST /api/appeals – username={}, gradeId={}", username, request.getGradeId());

        AppealResponse response = appealService.submitAppeal(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/appeals/my-appeals – list summary of the authenticated student's appeals.
     */
    @GetMapping({"/my-appeals", "/v1/my-appeals"})
    @IsStudent
    public ResponseEntity<List<AppealSummaryResponse>> getStudentAppeals(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(appealService.getStudentAppeals(username));
    }

    /**
     * GET /api/v1/appeals/{trackingCode} – get detailed information of a student appeal.
     */
    @GetMapping({"/{trackingCode}", "/v1/{trackingCode}"})
    @IsStudent
    public ResponseEntity<AppealDetailResponse> getAppealDetailByCode(
            Principal principal,
            @PathVariable String trackingCode) {
        String username = principal.getName();
        return ResponseEntity.ok(appealService.getAppealDetailByCode(trackingCode, username));
    }

    /**
     * Retrieve all appeals submitted by the authenticated student.
     */
    @GetMapping("/me")
    @IsStudent
    public ResponseEntity<List<AppealResponse>> getMyAppeals(Principal principal) {
        String username = principal.getName();
        log.debug("GET /api/appeals/me – username={}", username);

        List<AppealResponse> appeals = appealService.getMyAppeals(username);
        return ResponseEntity.ok(appeals);
    }

    /**
     * Retrieve a specific appeal belonging to the authenticated student.
     */
    @GetMapping("/me/{appealId}")
    @IsStudent
    public ResponseEntity<AppealResponse> getAppealById(
            Principal principal,
            @PathVariable Long appealId) {

        String username = principal.getName();
        log.debug("GET /api/appeals/me/{} – username={}", appealId, username);

        AppealResponse response = appealService.getAppealById(username, appealId);
        return ResponseEntity.ok(response);
    }

    /**
     * Withdraw a pending appeal.
     */
    @PutMapping("/me/{appealId}/withdraw")
    @IsStudent
    public ResponseEntity<AppealResponse> withdrawAppeal(
            Principal principal,
            @PathVariable Long appealId) {

        String username = principal.getName();
        log.debug("PUT /api/appeals/me/{}/withdraw – username={}", appealId, username);

        AppealResponse response = appealService.withdrawAppeal(username, appealId);
        return ResponseEntity.ok(response);
    }
}
