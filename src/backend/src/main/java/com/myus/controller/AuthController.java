package com.myus.controller;

import com.myus.dto.AuthRequest;
import com.myus.dto.AuthResponse;
import com.myus.entity.Student;
import com.myus.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public authentication endpoints for student accounts. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /** Authenticate a student and return an access token and user profile. */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        request.getUsername(), request.getPassword()));

        if (!(authentication.getPrincipal() instanceof Student student)) {
            throw new AuthenticationException("This login endpoint is for student accounts only") { };
        }

        AuthResponse.UserInfo user = new AuthResponse.UserInfo(
                student.getStudentId(),
                student.getUsername(),
                student.getEmail(),
                student.getRole().name(),
                displayName(student));

        return ResponseEntity.ok(new AuthResponse(
                jwtTokenProvider.generateToken(authentication),
                jwtTokenProvider.getExpirationMs(),
                user));
    }

    /** Stateless logout endpoint. */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    private String displayName(Student student) {
        return String.join(" ",
                student.getFirstName(),
                student.getMiddleName() == null ? "" : student.getMiddleName(),
                student.getLastName()).trim().replaceAll("\\s+", " ");
    }
}
