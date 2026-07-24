package com.myus.interfaces.rest;

import com.myus.application.dto.AuthRequest;
import com.myus.application.dto.AuthResponse;
import com.myus.application.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for authentication endpoints.
 *
 * <p>Exposes the public {@code /api/auth/login} endpoint.</p>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Authenticate a user and return a JWT access token.
     *
     * @param request the login credentials (username + password)
     * @return 200 OK with {@link AuthResponse} containing the token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout a user (stateless JWT invalidation on client side).
     *
     * @return 200 OK with success message
     */
    @PostMapping("/logout")
    public ResponseEntity<java.util.Map<String, String>> logout() {
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Logged out successfully"));
    }
}
