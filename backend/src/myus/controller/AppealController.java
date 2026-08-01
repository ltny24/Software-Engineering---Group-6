package myus.controller;

import myus.dto.AppealResponse;
import myus.dto.AppealSubmitRequest;
import myus.security.IsStudent;
import myus.service.AppealService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
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
 * REST controller for student grade appeal operations (T028, T030).
 *
 * <p>All endpoints require the {@code STUDENT} role via the
 * {@link IsStudent} annotation. The authenticated student is
 * resolved from the JWT token.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code POST /api/appeals}               – submit a grade appeal</li>
 *   <li>{@code GET  /api/appeals/me}             – list my appeals</li>
 *   <li>{@code GET  /api/appeals/me/{appealId}}  – get specific appeal</li>
 *   <li>{@code PUT  /api/appeals/me/{appealId}/withdraw} – withdraw a pending appeal</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping({"/api/appeals", "/api/v1/appeals"})
public class AppealController {

    private final AppealService appealService;

    public AppealController(AppealService appealService) {
        this.appealService = appealService;
    }

    /**
     * Submit a new grade appeal.
     *
     * @param principal the authenticated principal (injected from JWT)
     * @param request   the appeal submission payload
     * @return the created appeal (HTTP 201 Created)
     */
    @PostMapping
    @IsStudent
    public ResponseEntity<AppealResponse> submitAppeal(
            Principal principal,
            @Valid @RequestBody AppealSubmitRequest request) {

        String username = principal.getName();
        log.debug("POST /api/appeals – username={}, gradeId={}",
                username, request.getGradeId());

        AppealResponse response = appealService.submitAppeal(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/appeals/my-appeals – list summary of authenticated student's appeals.
     */
    @GetMapping({"/my-appeals", "/v1/my-appeals"})
    @IsStudent
    public ResponseEntity<List<myus.dto.appeal.AppealSummaryResponse>> getStudentAppeals(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(appealService.getStudentAppeals(username));
    }

    /**
     * GET /api/v1/appeals/{trackingCode} – get detailed information of a student appeal.
     */
    @GetMapping({"/{trackingCode}", "/v1/{trackingCode}"})
    @IsStudent
    public ResponseEntity<myus.dto.appeal.AppealDetailResponse> getAppealDetailByCode(
            Principal principal,
            @PathVariable String trackingCode) {
        String username = principal.getName();
        return ResponseEntity.ok(appealService.getAppealDetailByCode(trackingCode, username));
    }

    /**
     * Retrieve all appeals submitted by the authenticated student.
     *
     * @param principal the authenticated principal
     * @return list of the student's appeals
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
     *
     * @param principal the authenticated principal
     * @param appealId  the appeal ID
     * @return the appeal details
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
     * Withdraw a pending appeal. Only appeals in "Submitted" status
     * can be withdrawn.
     *
     * @param principal the authenticated principal
     * @param appealId  the appeal ID to withdraw
     * @return the updated appeal with status "Withdrawn"
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
