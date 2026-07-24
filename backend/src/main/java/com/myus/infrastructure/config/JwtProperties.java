package com.myus.infrastructure.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Binds JWT-related settings from {@code application.properties}.
 *
 * <pre>
 *   app.jwt.secret=...
 *   app.jwt.expiration-ms=86400000
 *   app.jwt.refresh-expiration-ms=604800000
 * </pre>
 *
 * @see com.myus.security.JwtTokenProvider
 */
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * Base64-encoded secret used to sign and verify JWT tokens.
     * Must be at least 256 bits for HS256.
     */
    @NotBlank(message = "JWT secret must not be blank")
    private String secret;

    /**
     * Access-token lifetime in milliseconds (default 24 h).
     */
    @Positive(message = "JWT expiration must be a positive number")
    private long expirationMs = 86_400_000L;

    /**
     * Refresh-token lifetime in milliseconds (default 7 days).
     */
    @Positive(message = "JWT refresh expiration must be a positive number")
    private long refreshExpirationMs = 604_800_000L;

    // ── Getters & Setters ────────────────────────────────────────

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    public void setRefreshExpirationMs(long refreshExpirationMs) {
        this.refreshExpirationMs = refreshExpirationMs;
    }
}
