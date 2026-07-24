package com.myus.application.service;

import com.myus.application.dto.CourseOfferingResponse;
import com.myus.application.dto.CourseResponse;
import com.myus.application.dto.EnrollmentRequest;
import com.myus.application.dto.EnrollmentResponse;
import com.myus.domain.model.Course;
import com.myus.domain.model.CourseOffering;
import com.myus.domain.model.CourseRegistration;
import com.myus.domain.model.Student;
import com.myus.domain.exception.EnrollmentException;
import com.myus.domain.exception.ResourceNotFoundException;
import com.myus.domain.repository.CourseOfferingRepository;
import com.myus.domain.repository.CourseRegistrationRepository;
import com.myus.domain.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Default implementation of {@link EnrollmentService}.
 *
 * <p>Handles course registration business logic including:
 * duplicate detection, capacity checking, and status transitions
 * as defined in the data model (Requested → Enrolled → Dropped).</p>
 */
@Slf4j
@Service
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final StudentRepository studentRepository;
    private final CourseOfferingRepository offeringRepository;
    private final CourseRegistrationRepository registrationRepository;

    public EnrollmentServiceImpl(StudentRepository studentRepository,
                                  CourseOfferingRepository offeringRepository,
                                  CourseRegistrationRepository registrationRepository) {
        this.studentRepository = studentRepository;
        this.offeringRepository = offeringRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public EnrollmentResponse registerCourse(String username, EnrollmentRequest request) {
        log.debug("Processing registration: username={}, offeringId={}", username, request.getOfferingId());

        // 1. Resolve the authenticated student
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));

        // 2. Resolve the target offering
        CourseOffering offering = offeringRepository.findById(request.getOfferingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course offering not found with id: " + request.getOfferingId()));

        // 3. Check for duplicate active registration
        registrationRepository.findActiveByStudentAndOffering(
                student.getStudentId(), offering.getOfferingId()
        ).ifPresent(existing -> {
            throw new EnrollmentException(
                    "Student is already registered for this offering (registrationId: "
                    + existing.getRegistrationId() + ", status: " + existing.getStatus() + ")");
        });

        // 4. Check capacity
        long enrolledCount = registrationRepository.countActiveByOfferingId(offering.getOfferingId());
        int capacity = offering.getCourse().getCapacity() != null ? offering.getCourse().getCapacity() : 0;

        if (capacity > 0 && enrolledCount >= capacity) {
            throw new EnrollmentException(
                    "Course offering is full. Capacity: " + capacity
                    + ", currently enrolled: " + enrolledCount);
        }

        // 5. Create the registration record
        CourseRegistration registration = new CourseRegistration();
        registration.setStudent(student);
        registration.setOffering(offering);
        registration.setStatus("Enrolled");
        registration.setRegisteredAt(LocalDateTime.now());

        CourseRegistration saved = registrationRepository.save(registration);
        log.info("Registration created: id={}, student={}, offering={}, status={}",
                saved.getRegistrationId(), username, offering.getOfferingId(), saved.getStatus());

        return mapToEnrollmentResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyRegistrations(String username) {
        log.debug("Fetching registrations for username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));

        List<CourseRegistration> registrations =
                registrationRepository.findByStudentIdWithOfferingAndCourse(student.getStudentId());

        log.debug("Found {} registrations for student id={}", registrations.size(), student.getStudentId());

        return registrations.stream()
                .map(this::mapToEnrollmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentResponse dropRegistration(String username, Long registrationId) {
        log.debug("Processing drop: username={}, registrationId={}", username, registrationId);

        // 1. Resolve the student
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));

        // 2. Find the registration
        CourseRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Registration not found with id: " + registrationId));

        // 3. Verify ownership
        if (!registration.getStudent().getStudentId().equals(student.getStudentId())) {
            throw new EnrollmentException("Registration does not belong to the authenticated student");
        }

        // 4. Check if already dropped
        if ("Dropped".equals(registration.getStatus())) {
            throw new EnrollmentException("Registration is already dropped");
        }

        // 5. Update status
        registration.setStatus("Dropped");
        CourseRegistration updated = registrationRepository.save(registration);
        log.info("Registration dropped: id={}, student={}", registrationId, username);

        return mapToEnrollmentResponse(updated);
    }

    // ── Private mapping helpers ────────────────────────────────

    /**
     * Maps a CourseRegistration entity to its response DTO.
     */
    private EnrollmentResponse mapToEnrollmentResponse(CourseRegistration registration) {
        CourseOfferingResponse offeringDto = mapToOfferingResponse(registration.getOffering());

        return new EnrollmentResponse(
                registration.getRegistrationId(),
                registration.getStudent().getStudentId(),
                registration.getStatus(),
                registration.getRegisteredAt(),
                offeringDto
        );
    }

    /**
     * Maps a CourseOffering entity to its response DTO with enrollment counts.
     */
    private CourseOfferingResponse mapToOfferingResponse(CourseOffering offering) {
        CourseResponse courseDto = mapToCourseResponse(offering.getCourse());

        long enrolledCount = registrationRepository.countActiveByOfferingId(offering.getOfferingId());
        int capacity = offering.getCourse().getCapacity() != null ? offering.getCourse().getCapacity() : 0;
        int availableSeats = Math.max(0, capacity - (int) enrolledCount);

        return new CourseOfferingResponse(
                offering.getOfferingId(),
                offering.getSection(),
                offering.getTerm(),
                offering.getSchedule(),
                offering.getInstructor(),
                offering.getLocation(),
                offering.getRoom(),
                (int) enrolledCount,
                availableSeats,
                courseDto
        );
    }

    /**
     * Maps a Course entity to its response DTO.
     */
    private CourseResponse mapToCourseResponse(Course course) {
        return new CourseResponse(
                course.getCourseId(),
                course.getCourseCode(),
                course.getCourseName(),
                course.getDescription(),
                course.getCredits(),
                course.getPrerequisites(),
                course.getDepartment(),
                course.getSemester(),
                course.getCapacity()
        );
    }
}
