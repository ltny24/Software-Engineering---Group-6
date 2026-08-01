package myus.controller;

import myus.dto.StudentProfileResponse;
import myus.dto.StudentProfileUpdateRequest;
import myus.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.security.Principal;

/**
 * REST controller for student profile operations.
 *
 * <p>All endpoints require the {@code STUDENT} role. The authenticated
 * student is resolved from the JWT token and all business logic is
 * delegated to {@link ProfileService}.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> getProfile(Principal principal) {
        String username = principal.getName();
        log.debug("GET /api/v1/profile – username={}", username);
        return ResponseEntity.ok(profileService.getProfile(username));
    }

    @PutMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> updateProfile(
            Principal principal,
            @Valid @RequestBody StudentProfileUpdateRequest updateRequest) {
        String username = principal.getName();
        log.debug("PUT /api/v1/profile – username={}", username);
        return ResponseEntity.ok(profileService.updateProfile(username, updateRequest));
    }
}
