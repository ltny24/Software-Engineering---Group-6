package com.myus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for {@code POST /api/auth/reset-password}.
 * User submits username, verification code, and new password.
 */
public class ResetPasswordRequest {

    @NotBlank(message = "Username must not be blank")
    private String username;

    @NotBlank(message = "Verification code must not be blank")
    private String token;

    @NotBlank(message = "New password must not be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;

    public ResetPasswordRequest() {}

    public ResetPasswordRequest(String username, String token, String newPassword) {
        this.username = username;
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
