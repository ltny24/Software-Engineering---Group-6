package com.myus.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for {@code POST /api/auth/forgot-password}.
 * User submits their username (student ID) to receive a reset verification code.
 */
public class ForgotPasswordRequest {

    @NotBlank(message = "Username must not be blank")
    private String username;

    public ForgotPasswordRequest() {}

    public ForgotPasswordRequest(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
