package com.myus.application.service.impl;

import com.myus.application.dto.AuthRequest;
import com.myus.application.dto.AuthResponse;
import com.myus.application.service.AuthService;
import com.myus.domain.model.Administrator;
import com.myus.domain.model.Student;
import com.myus.infrastructure.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

/**
 * Implementation of {@link AuthService} that authenticates users
 * via Spring Security's {@link AuthenticationManager} and issues
 * JWT tokens.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String accessToken = tokenProvider.generateToken(authentication);

        // Extract user identity from the authenticated principal
        Object principal = authentication.getPrincipal();
        Long userId = null;
        String role = null;

        if (principal instanceof Student student) {
            userId = student.getStudentId();
            role = student.getRole().name();
        } else if (principal instanceof Administrator admin) {
            userId = admin.getAdminId();
            role = admin.getRole().name();
        }

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(userId, role);

        AuthResponse response = new AuthResponse(
                accessToken,
                tokenProvider.getExpirationMs(),
                userInfo
        );
        response.setTokenType("Bearer");

        log.info("User '{}' authenticated successfully with role '{}'", request.getUsername(), role);
        return response;
    }
}
