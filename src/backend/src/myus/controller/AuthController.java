package myus.controller;

import myus.dto.AuthRequest;
import myus.dto.AuthResponse;
import myus.entity.Administrator;
import myus.entity.Student;
import myus.security.JwtTokenProvider;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
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

            // Extract user identity from the authenticated principal
            Long userId = null;
            String username = authRequest.getUsername();
            String email = null;
            String displayName = null;
            String role = null;

            if (userDetails instanceof Student student) {
                userId = student.getStudentId();
                email = student.getEmail();
                displayName = (student.getFirstName() != null ? student.getFirstName() : "")
                        + (student.getLastName() != null ? " " + student.getLastName() : "");
                displayName = displayName.trim();
            } else if (userDetails instanceof Administrator admin) {
                userId = admin.getAdminId();
                email = admin.getEmail();
                displayName = admin.getDisplayName() != null
                        ? admin.getDisplayName()
                        : admin.getUsername();
            }

            // Strip Spring Security's ROLE_ prefix so the frontend receives
            // clean role names ("STUDENT", "ADMINISTRATOR")
            role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                    .findFirst()
                    .orElse(null);

            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    userId, username, email, role, displayName);
            AuthResponse response = new AuthResponse(
                    token, jwtTokenProvider.getExpirationMs(), userInfo);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            log.warn("Login failed for username={}: {}", authRequest.getUsername(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
