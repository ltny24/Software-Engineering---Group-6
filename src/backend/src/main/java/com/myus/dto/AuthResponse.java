package com.myus.dto;

/**
 * Response DTO for {@code POST /api/auth/login}.
 *
 * <p>Matches the API contract:</p>
 * <pre>
 * {
 *   "accessToken": "eyJhbG...",
 *   "tokenType": "Bearer",
 *   "expiresIn": 86400000,
 *   "user": { "id": 1, "username": "24120001", "role": "STUDENT" }
 * }
 * </pre>
 */
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserInfo user;

    // ── Constructors ─────────────────────────────────────────────

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, long expiresIn, UserInfo user) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    // ── Getters & Setters ────────────────────────────────────────

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    // ── Nested UserInfo ──────────────────────────────────────────

    /**
     * Minimal user identity included in the authentication response.
     */
    public static class UserInfo {

        private Long id;
        private String username;
        private String email;
        private String role;
        private String displayName;

        public UserInfo() {
        }

        public UserInfo(Long id, String username, String email, String role, String displayName) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.displayName = displayName;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }
    }
}
