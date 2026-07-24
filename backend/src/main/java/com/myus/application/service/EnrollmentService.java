package com.myus.application.service;

import com.myus.application.dto.EnrollmentRequest;
import com.myus.application.dto.EnrollmentResponse;

import java.util.List;

/**
 * Service contract for student course enrollment operations.
 *
 * <p>Manages the full enrollment lifecycle: registering, viewing,
 * and dropping course registrations for authenticated students.</p>
 */
public interface EnrollmentService {

    /**
     * Register the authenticated student for a course offering.
     *
     * @param username the authenticated student's username
     * @param request  contains the target offering ID
     * @return enrollment confirmation DTO
     * @throws com.myus.exception.ResourceNotFoundException if student or offering not found
     * @throws com.myus.exception.EnrollmentException       if duplicate or capacity exceeded
     */
    EnrollmentResponse registerCourse(String username, EnrollmentRequest request);

    /**
     * Retrieve all enrollment records for the authenticated student.
     *
     * @param username the authenticated student's username
     * @return list of enrollment DTOs ordered by registration date (newest first)
     */
    List<EnrollmentResponse> getMyRegistrations(String username);

    /**
     * Drop (withdraw from) an existing enrollment.
     *
     * @param username       the authenticated student's username
     * @param registrationId the registration to drop
     * @return updated enrollment DTO with status "Dropped"
     * @throws com.myus.exception.ResourceNotFoundException if registration not found
     * @throws com.myus.exception.EnrollmentException       if not owned by student or already dropped
     */
    EnrollmentResponse dropRegistration(String username, Long registrationId);
}
