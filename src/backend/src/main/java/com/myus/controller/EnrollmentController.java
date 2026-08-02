package com.myus.controller;

import com.myus.dto.EnrollmentRequest;
import com.myus.dto.EnrollmentResponse;
import com.myus.security.IsStudent;
import com.myus.service.EnrollmentService;
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
 * REST controller for student course enrollment operations (T020).
 *
 * <p>All endpoints require the {@code STUDENT} role via the
 * {@link IsStudent} annotation. The authenticated student is
 * resolved from the JWT token.</p>
 *
 * <p>API contract references:</p>
 * <ul>
 *   <li>{@code POST /api/registrations} – register for a course</li>
 *   <li>{@code GET  /api/registrations/me} – view my enrollments</li>
 *   <li>{@code PUT  /api/registrations/{id}/drop} – drop an enrollment</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/registrations")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    /**
     * Register the authenticated student for a course offering.
     *
     * @param principal the authenticated principal (injected from JWT)
     * @param request     the enrollment request containing {@code offeringId}
     * @return the created enrollment record (HTTP 201 Created)
     */
    @PostMapping
    @IsStudent
    public ResponseEntity<EnrollmentResponse> registerCourse(
            Principal principal,
            @Valid @RequestBody EnrollmentRequest request) {

        String username = principal.getName();
        log.debug("POST /api/registrations – username={}, offeringId={}",
                username, request.getOfferingId());

        EnrollmentResponse response = enrollmentService.registerCourse(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieve all enrollment records for the authenticated student.
     *
     * @param principal the authenticated principal
     * @return list of enrollment records
     */
    @GetMapping("/me")
    @IsStudent
    public ResponseEntity<List<EnrollmentResponse>> getMyRegistrations(
            Principal principal) {

        String username = principal.getName();
        log.debug("GET /api/registrations/me – username={}", username);

        List<EnrollmentResponse> registrations = enrollmentService.getMyRegistrations(username);
        return ResponseEntity.ok(registrations);
    }

    /**
     * Drop (withdraw from) an existing enrollment.
     *
     * @param principal      the authenticated principal
     * @param registrationId the registration to drop
     * @return the updated enrollment record with status "Dropped"
     */
    @PutMapping("/{registrationId}/drop")
    @IsStudent
    public ResponseEntity<EnrollmentResponse> dropRegistration(
            Principal principal,
            @PathVariable Long registrationId) {

        String username = principal.getName();
        log.debug("PUT /api/registrations/{}/drop – username={}", registrationId, username);

        EnrollmentResponse response = enrollmentService.dropRegistration(username, registrationId);
        return ResponseEntity.ok(response);
    }
}
