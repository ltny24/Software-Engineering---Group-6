package com.myus.controller;

import com.myus.dto.StudentProfileResponse;
import com.myus.dto.StudentProfileUpdateRequest;
import com.myus.entity.Administrator;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.AdministratorRepository;
import com.myus.repository.StudentRepository;
import com.myus.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

import java.security.Principal;

/**
 * Controller responsible for student profile retrieval.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final StudentRepository studentRepository;
    private final AdministratorRepository administratorRepository;
    private final ProfileService profileService;

    public ProfileController(StudentRepository studentRepository, AdministratorRepository administratorRepository, ProfileService profileService) {
        this.studentRepository = studentRepository;
        this.administratorRepository = administratorRepository;
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMINISTRATOR')")
    public ResponseEntity<StudentProfileResponse> getProfile(Principal principal, Authentication authentication) {

        if (principal == null) {
            log.warn("Unauthorized access attempt to profile endpoint without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getName();
        log.debug("Loading profile for authenticated user username={}", username);

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRATOR"));

        if (isAdmin) {
            Administrator admin = administratorRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Admin profile not found for username: " + username));
            return ResponseEntity.ok(mapAdminToDto(admin));
        }

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for username: " + username));

        StudentProfileResponse response = mapToDto(student);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> updateProfile(
            Principal principal,
            @Valid @RequestBody StudentProfileUpdateRequest updateRequest) {

        if (principal == null) {
            log.warn("Unauthorized access attempt to update profile without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getName();
        log.debug("Received profile update request for username={}", username);

        StudentProfileResponse updatedProfile = profileService.updateProfile(username, updateRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    private StudentProfileResponse mapToDto(Student student) {
        return new StudentProfileResponse(
                student.getStudentId(),
                student.getUsername(),
                student.getEmail(),
                student.getFirstName(),
                student.getMiddleName(),
                student.getLastName(),
                student.getPhone(),
                student.getAddress(),
                student.getDateOfBirth(),
                student.getStudentType(),
                student.getMajor(),
                student.getEnrollmentStatus(),
                student.getRegistrationStatus()
        );
    }

    private StudentProfileResponse mapAdminToDto(Administrator admin) {
        return new StudentProfileResponse(
                admin.getAdminId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getDisplayName(),
                null,
                null,
                null,
                null,
                null,
                "ADMIN",
                admin.getDepartment(),
                "ACTIVE",
                "REGISTERED"
        );
    }
}
