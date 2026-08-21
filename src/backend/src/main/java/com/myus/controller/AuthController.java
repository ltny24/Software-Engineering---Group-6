package com.myus.controller;

import com.myus.dto.*;
import com.myus.entity.Administrator;
import com.myus.entity.PasswordResetToken;
import com.myus.entity.Student;
import com.myus.repository.PasswordResetTokenRepository;
import com.myus.repository.StudentRepository;
import com.myus.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final StudentRepository studentRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          StudentRepository studentRepository,
                          PasswordResetTokenRepository passwordResetTokenRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.studentRepository = studentRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(authentication);
            Long userId = null;
            String username = null;
            String displayName = null;
            if (userDetails instanceof Student student) {
                userId = student.getStudentId();
                username = student.getUsername();
                displayName = student.getFirstName() + " " + student.getLastName();
            } else if (userDetails instanceof Administrator admin) {
                userId = admin.getAdminId();
                username = admin.getUsername();
                displayName = admin.getDisplayName() != null ? admin.getDisplayName() : admin.getUsername();
            }

            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse(null);

            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(userId, username, role, displayName);
            AuthResponse response = new AuthResponse(token, jwtTokenProvider.getExpirationMs(), userInfo);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            log.warn("Login failed for username={}: {}", authRequest.getUsername(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // ── Forgot Password ────────────────────────────────────────────────────

    /**
     * POST /api/auth/forgot-password
     * Accepts a username (student ID), generates a 6-digit verification code,
     * and returns the masked email address the code was "sent" to.
     * In demo mode, the verification code is also returned in the response.
     */
    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String username = request.getUsername().trim();

        // Look up the student by username
        var studentOpt = studentRepository.findByUsername(username);
        if (studentOpt.isEmpty()) {
            log.warn("Forgot-password: username '{}' not found", username);
            // Return generic message to avoid user enumeration
            return ResponseEntity.ok(Map.of(
                    "message", "If the account exists, a verification code has been sent to the registered email.",
                    "maskedEmail", "***@***",
                    "verificationCode", ""
            ));
        }

        Student student = studentOpt.get();

        // Invalidate any existing unused tokens for this user
        passwordResetTokenRepository.invalidateExistingTokens(username);

        // Generate a 6-digit verification code
        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        // Save the token
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUsername(username);
        resetToken.setToken(code);
        resetToken.setExpiresAt(expiresAt);
        resetToken.setUsed(false);
        passwordResetTokenRepository.save(resetToken);

        // Mask the email for display (e.g., 2412****@student.hcmus.edu.vn)
        String email = student.getEmail();
        String maskedEmail = maskEmail(email);

        // Simulate sending email (log to console for demo)
        log.info("============================================");
        log.info("PASSWORD RESET CODE for {}: {}", username, code);
        log.info("Would send to email: {}", email);
        log.info("Expires at: {}", expiresAt);
        log.info("============================================");

        ForgotPasswordResponse response = new ForgotPasswordResponse(
                "Verification code sent to your registered email.",
                maskedEmail,
                code // Included only for demo/testing
        );

        return ResponseEntity.ok(response);
    }

    // ── Reset Password ─────────────────────────────────────────────────────

    /**
     * POST /api/auth/reset-password
     * Accepts username, verification code, and new password.
     * Validates the code and updates the password.
     */
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String username = request.getUsername().trim();
        String token = request.getToken().trim();
        String newPassword = request.getNewPassword();

        // Find a valid, unused, non-expired token
        var tokenOpt = passwordResetTokenRepository
                .findByUsernameAndTokenAndUsedFalse(username, token);

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Invalid or expired verification code. Please request a new one."
            ));
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.isExpired()) {
            resetToken.setUsed(true);
            passwordResetTokenRepository.save(resetToken);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Verification code has expired. Please request a new one."
            ));
        }

        // Find the student
        var studentOpt = studentRepository.findByUsername(username);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Account not found."
            ));
        }

        Student student = studentOpt.get();

        // Update password with BCrypt encoding
        student.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(student);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset successful for user: {}", username);

        return ResponseEntity.ok(Map.of(
                "message", "Password has been reset successfully. You can now log in with your new password."
        ));
    }

    // ── Helper ─────────────────────────────────────────────────────────────

    /**
     * Masks an email address for display.
     * e.g., "24127192@student.hcmus.edu.vn" → "2412****@student.hcmus.edu.vn"
     */
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***@***";
        }
        int atIndex = email.indexOf('@');
        String localPart = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (localPart.length() <= 4) {
            return localPart.charAt(0) + "****" + domain;
        }
        return localPart.substring(0, 4) + "****" + domain;
    }
}
