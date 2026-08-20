package com.myus.controller;

import com.myus.dto.StudentProfileResponse;
import com.myus.dto.StudentProfileUpdateRequest;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
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
    private final ProfileService profileService;

    public ProfileController(StudentRepository studentRepository, ProfileService profileService) {
        this.studentRepository = studentRepository;
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> getProfile(Principal principal) {

        if (principal == null) {
            log.warn("Unauthorized access attempt to profile endpoint without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getName();
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
}
