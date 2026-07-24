package com.myus.infrastructure.security;

import com.myus.infrastructure.config.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * Utility component for creating, parsing, and validating JWT tokens.
 *
 * <p>Uses the JJWT 0.12.x API with HMAC-SHA256 signing.</p>
 *
 * @see JwtProperties
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtTokenProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtProperties.getSecret()));
    }

    // ── Token Generation ─────────────────────────────────────────

    /**
     * Generate an access token for the authenticated user.
     *
     * @param authentication the current Spring Security authentication
     * @return signed JWT string
     */
    public String generateToken(Authentication authentication) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getExpirationMs());

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(authentication.getName())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Generate a refresh token (longer-lived, no role claims).
     *
     * @param username the subject for the refresh token
     * @return signed JWT string
     */
    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getRefreshExpirationMs());

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    // ── Token Parsing ────────────────────────────────────────────

    /**
     * Extract the username (subject) from a JWT token.
     *
     * @param token the raw JWT string
     * @return the subject claim
     */
    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Extract the roles claim from a JWT token.
     *
     * @param token the raw JWT string
     * @return comma-separated role string, or {@code null}
     */
    public String getRolesFromToken(String token) {
        return parseClaims(token).get("roles", String.class);
    }

    /**
     * Return the configured access-token expiration in milliseconds.
     */
    public long getExpirationMs() {
        return jwtProperties.getExpirationMs();
    }

    // ── Token Validation ─────────────────────────────────────────

    /**
     * Validate a JWT token's signature and expiration.
     *
     * @param token the raw JWT string
     * @return {@code true} if valid, {@code false} otherwise
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Malformed JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        }
        return false;
    }

    // ── Internal ─────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
