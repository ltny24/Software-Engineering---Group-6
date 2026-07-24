package com.myus.interfaces.rest;

import com.myus.application.dto.StudentProfileResponse;
import com.myus.application.dto.StudentProfileUpdateRequest;
import com.myus.domain.model.Student;
import com.myus.domain.exception.ResourceNotFoundException;
import com.myus.domain.repository.StudentRepository;
import com.myus.application.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

/**
 * Controller responsible for student profile retrieval.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final StudentRepository studentRepository;
    private final ProfileService profileService;

    public ProfileController(StudentRepository studentRepository, ProfileService profileService) {
        this.studentRepository = studentRepository;
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            log.warn("Unauthorized access attempt to profile endpoint without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = userDetails.getUsername();
        log.debug("Loading profile for authenticated student username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for username: " + username));

        StudentProfileResponse response = mapToDto(student);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    @PreAuthorize("hasRole('STUDENT')")
        public ResponseEntity<StudentProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StudentProfileUpdateRequest updateRequest) {

        if (userDetails == null) {
            log.warn("Unauthorized access attempt to update profile without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = userDetails.getUsername();
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
}
