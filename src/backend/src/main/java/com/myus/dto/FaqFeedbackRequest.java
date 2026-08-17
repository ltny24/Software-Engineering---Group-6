package com.myus.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for rating an FAQ answer as helpful or not helpful (AF3).
 */
public class FaqFeedbackRequest {

    @NotNull
    private Boolean helpful;

    public FaqFeedbackRequest() {
    }

    public FaqFeedbackRequest(Boolean helpful) {
        this.helpful = helpful;
    }

    public Boolean getHelpful() {
        return helpful;
    }

    public void setHelpful(Boolean helpful) {
        this.helpful = helpful;
    }
}
