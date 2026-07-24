package com.myus.application.service;

import com.myus.application.dto.AppealResponse;
import com.myus.application.dto.AppealReviewRequest;
import com.myus.application.dto.AppealSubmitRequest;

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
     *
     * @param username the authenticated student's username
     * @param request  the appeal submission payload
     * @return the created appeal
     */
    AppealResponse submitAppeal(String username, AppealSubmitRequest request);

    /**
     * Retrieve all appeals submitted by the authenticated student.
     *
     * @param username the authenticated student's username
     * @return list of the student's appeals, ordered by submission date descending
     */
    List<AppealResponse> getMyAppeals(String username);

    /**
     * Retrieve a specific appeal belonging to the authenticated student.
     *
     * @param username the authenticated student's username
     * @param appealId the appeal ID
     * @return the appeal details
     */
    AppealResponse getAppealById(String username, Long appealId);

    /**
     * Withdraw a pending appeal. Only appeals in "Submitted" status
     * can be withdrawn by the student.
     *
     * @param username the authenticated student's username
     * @param appealId the appeal ID to withdraw
     * @return the updated appeal with status "Withdrawn"
     */
    AppealResponse withdrawAppeal(String username, Long appealId);

    // ── Administrator Operations ────────────────────────────────

    /**
     * Retrieve all appeals, optionally filtered by status.
     * Used by administrators.
     *
     * @param statusFilter optional status to filter by (null for all)
     * @return list of appeals
     */
    List<AppealResponse> getAllAppeals(String statusFilter);

    /**
     * Retrieve a specific appeal by ID. Used by administrators.
     *
     * @param appealId the appeal ID
     * @return the appeal details
     */
    AppealResponse getAppealByIdAdmin(Long appealId);

    /**
     * Review and process a grade appeal. Allows the administrator to
     * update the status, add comments, and set a fee payment deadline.
     *
     * @param appealId      the appeal ID to review
     * @param adminUsername  the reviewing administrator's username
     * @param request       the review payload
     * @return the updated appeal
     */
    AppealResponse reviewAppeal(Long appealId, String adminUsername, AppealReviewRequest request);
}
