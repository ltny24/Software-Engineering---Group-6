package com.myus.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for {@code POST /api/auth/login}.
 *
 * @see com.myus.security.JwtTokenProvider
 */
public class AuthRequest {

    @NotBlank(message = "Username must not be blank")
    private String username;

    @NotBlank(message = "Password must not be blank")
    private String password;

    // ── Constructors ─────────────────────────────────────────────

    public AuthRequest() {
    }

    public AuthRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // ── Getters & Setters ────────────────────────────────────────

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
