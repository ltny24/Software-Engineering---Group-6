package com.myus.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for course enrollment.
 *
 * <p>Matches the API contract: {@code POST /api/registrations}
 * with body {@code { "offeringId": ... }}.</p>
 */
public class EnrollmentRequest {

    @NotNull(message = "Offering ID is required")
    private Long offeringId;

    public EnrollmentRequest() {
    }

    public EnrollmentRequest(Long offeringId) {
        this.offeringId = offeringId;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public void setOfferingId(Long offeringId) {
        this.offeringId = offeringId;
    }
}
