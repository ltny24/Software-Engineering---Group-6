package com.myus.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Response DTO for enrollment (registration) results.
 *
 * <p>Returned after a student registers for a course offering or
 * queries their current enrollments. Includes nested
 * {@link CourseOfferingResponse} so the frontend has full context
 * about the enrolled course and section.</p>
 */
public class EnrollmentResponse {

    private Long registrationId;
    private Long studentId;
    private String status;
    private LocalDateTime registeredAt;
    private CourseOfferingResponse offering;
    private List<String> warnings;

    public EnrollmentResponse() {
    }

    public EnrollmentResponse(Long registrationId,
                               Long studentId,
                               String status,
                               LocalDateTime registeredAt,
                               CourseOfferingResponse offering) {
        this.registrationId = registrationId;
        this.studentId = studentId;
        this.status = status;
        this.registeredAt = registeredAt;
        this.offering = offering;
        this.warnings = Collections.emptyList();
    }

    public EnrollmentResponse(Long registrationId,
                               Long studentId,
                               String status,
                               LocalDateTime registeredAt,
                               CourseOfferingResponse offering,
                               List<String> warnings) {
        this.registrationId = registrationId;
        this.studentId = studentId;
        this.status = status;
        this.registeredAt = registeredAt;
        this.offering = offering;
        this.warnings = warnings != null ? new ArrayList<>(warnings) : Collections.emptyList();
    }

    // ── Getters & Setters ──────────────────────────────────────

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public CourseOfferingResponse getOffering() {
        return offering;
    }

    public void setOffering(CourseOfferingResponse offering) {
        this.offering = offering;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }
}
