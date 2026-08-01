package com.myus.controller;

import com.myus.dto.AppealResponse;
import com.myus.dto.AppealReviewRequest;
import com.myus.security.IsAdministrator;
import com.myus.service.AppealService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * REST controller for administrator appeal processing operations (T039).
 *
 * <p>All endpoints require the {@code ADMINISTRATOR} role via the
 * {@link IsAdministrator} annotation.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code GET /api/admin/appeals}                    – list all appeals (optional status filter)</li>
 *   <li>{@code GET /api/admin/appeals/{appealId}}         – get specific appeal details</li>
 *   <li>{@code PUT /api/admin/appeals/{appealId}/review}  – review/process an appeal</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/appeals")
public class AppealAdminController {

    private final AppealService appealService;

    public AppealAdminController(AppealService appealService) {
        this.appealService = appealService;
    }

    /**
     * List all appeals, optionally filtered by status.
     *
     * @param status optional status filter (e.g., "Submitted", "Under Review", "Approved", "Denied")
     * @return list of appeals
     */
    @GetMapping
    @IsAdministrator
    public ResponseEntity<List<AppealResponse>> getAllAppeals(
            @RequestParam(required = false) String status) {

        log.debug("GET /api/admin/appeals – statusFilter={}", status);

        List<AppealResponse> appeals = appealService.getAllAppeals(status);
        return ResponseEntity.ok(appeals);
    }

    /**
     * Retrieve a specific appeal by ID.
     *
     * @param appealId the appeal ID
     * @return the appeal details
     */
    @GetMapping("/{appealId}")
    @IsAdministrator
    public ResponseEntity<AppealResponse> getAppealById(
            @PathVariable Long appealId) {

        log.debug("GET /api/admin/appeals/{}", appealId);

        AppealResponse response = appealService.getAppealByIdAdmin(appealId);
        return ResponseEntity.ok(response);
    }

    /**
     * Review and process a grade appeal.
     *
     * <p>Allows the administrator to update the appeal status,
     * add reviewer comments, and optionally set a fee payment deadline.</p>
     *
     * @param principal the authenticated admin principal
     * @param appealId  the appeal ID to review
     * @param request   the review payload
     * @return the updated appeal
     */
    @PutMapping("/{appealId}/review")
    @IsAdministrator
    public ResponseEntity<AppealResponse> reviewAppeal(
            Principal principal,
            @PathVariable Long appealId,
            @Valid @RequestBody AppealReviewRequest request) {

        String adminUsername = principal.getName();
        log.debug("PUT /api/admin/appeals/{}/review – admin={}, newStatus={}",
                appealId, adminUsername, request.getStatus());

        AppealResponse response = appealService.reviewAppeal(appealId, adminUsername, request);
        return ResponseEntity.ok(response);
    }
}
