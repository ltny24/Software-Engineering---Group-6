package com.myus.service;

import com.myus.dto.StudentProfileResponse;
import com.myus.dto.StudentProfileUpdateRequest;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

/**
 * Default implementation for student profile management.
 */
@Slf4j
@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final StudentRepository studentRepository;

    public ProfileServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentProfileResponse updateProfile(String username, StudentProfileUpdateRequest updateRequest) {
        log.debug("Updating profile for username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for username: " + username));

        log.debug("Loaded student entity for profile update: id={}, username={}", student.getStudentId(), username);

        // Only allow safe, student-editable fields to be changed (phone, address).
        if (updateRequest.getPhone() != null) {
            student.setPhone(updateRequest.getPhone());
            log.debug("Allowed update applied: phone");
        }

        if (updateRequest.getAddress() != null) {
            student.setAddress(updateRequest.getAddress());
            log.debug("Allowed update applied: address");
        }

        // Update metadata
        student.setUpdatedAt(LocalDateTime.now());

        Student updatedStudent = studentRepository.save(student);
        log.info("Student profile updated successfully for username={}", username);

        return mapToResponse(updatedStudent);
    }

    private StudentProfileResponse mapToResponse(Student student) {
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
