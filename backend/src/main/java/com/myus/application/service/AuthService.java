package com.myus.application.service;

import com.myus.application.dto.AuthRequest;
import com.myus.application.dto.AuthResponse;

/**
 * Authentication use-case interface.
 *
 * <p>Defines the contract for user login and token refresh operations.</p>
 */
public interface AuthService {

    /**
     * Authenticate a user with username and password credentials.
     *
     * @param request the login request containing username and password
     * @return an {@link AuthResponse} with the JWT access token and user info
     */
    AuthResponse login(AuthRequest request);
}
