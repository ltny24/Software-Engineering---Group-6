package com.myus.service;

import com.myus.dto.AppealResponse;
import com.myus.dto.AppealReviewRequest;
import com.myus.dto.AppealSubmitRequest;
import myus.dto.appeal.AppealDetailResponse;
import myus.dto.appeal.AppealSummaryResponse;

import java.util.List;

/**
 * Service contract for grade appeal operations.
 *
 * <p>Provides methods for both student-facing workflows
 * (submit, view, withdraw) and administrator-facing workflows
 * (list all, review/process).</p>
 */
public interface AppealService {

    // ── Student Operations ──────────────────────────────────────

    /**
     * Submit a new grade appeal for the authenticated student.
     */
    AppealResponse submitAppeal(String username, AppealSubmitRequest request);

    /**
     * Retrieve summary list of appeals for the student tracking dashboard.
     */
    List<AppealSummaryResponse> getStudentAppeals(String username);

    /**
     * Retrieve detailed appeal info by tracking code or ID for the student.
     */
    AppealDetailResponse getAppealDetailByCode(String trackingCode, String username);

    /**
     * Retrieve all appeals submitted by the authenticated student.
     */
    List<AppealResponse> getMyAppeals(String username);

    /**
     * Retrieve a specific appeal belonging to the authenticated student.
     */
    AppealResponse getAppealById(String username, Long appealId);

    /**
     * Withdraw a pending appeal.
     */
    AppealResponse withdrawAppeal(String username, Long appealId);

    // ── Administrator Operations ────────────────────────────────

    /**
     * Retrieve all appeals, optionally filtered by status.
     */
    List<AppealResponse> getAllAppeals(String statusFilter);

    /**
     * Retrieve a specific appeal by ID.
     */
    AppealResponse getAppealByIdAdmin(Long appealId);

    /**
     * Review and process a grade appeal.
     */
    AppealResponse reviewAppeal(Long appealId, String adminUsername, AppealReviewRequest request);
}
