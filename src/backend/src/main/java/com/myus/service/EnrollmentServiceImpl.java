package com.myus.service;

import com.myus.dto.CourseOfferingResponse;
import com.myus.dto.CourseResponse;
import com.myus.dto.EnrollmentRequest;
import com.myus.dto.EnrollmentResponse;
import com.myus.entity.Course;
import com.myus.entity.CourseOffering;
import com.myus.entity.CourseRegistration;
import com.myus.entity.Student;
import com.myus.exception.EnrollmentException;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.CourseOfferingRepository;
import com.myus.repository.CourseRegistrationRepository;
import com.myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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

    private static final int MAX_CREDITS_PER_TERM = 24;

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

        // 5. Check credit limit for the term (max 24 credits per semester)
        List<CourseRegistration> activeRegistrations =
                registrationRepository.findByStudentIdWithOfferingAndCourse(student.getStudentId());
        String targetTerm = offering.getTerm();

        int currentCredits = activeRegistrations.stream()
                .filter(r -> !"Dropped".equals(r.getStatus()))
                .filter(r -> targetTerm != null && targetTerm.equals(r.getOffering().getTerm()))
                .mapToInt(r -> {
                    Integer credits = r.getOffering().getCourse().getCredits();
                    return credits != null ? credits : 0;
                })
                .sum();
        int newCourseCredits = offering.getCourse().getCredits() != null
                ? offering.getCourse().getCredits() : 0;

        if (currentCredits + newCourseCredits > MAX_CREDITS_PER_TERM) {
            throw new EnrollmentException(
                    "Credit limit exceeded for term " + targetTerm
                    + ". Currently registered: " + currentCredits + " credits"
                    + ", this course: " + newCourseCredits + " credits"
                    + ", max allowed: " + MAX_CREDITS_PER_TERM + " credits.");
        }

        // 6. Detect schedule conflicts (do not block — collect warnings)
        List<String> conflictWarnings = new java.util.ArrayList<>();
        String newSchedule = offering.getSchedule();

        if (newSchedule != null && !newSchedule.isBlank()) {
            for (CourseRegistration activeReg : activeRegistrations) {
                if (!"Dropped".equals(activeReg.getStatus())) {
                    String existingSchedule = activeReg.getOffering().getSchedule();
                    if (existingSchedule != null && !existingSchedule.isBlank()
                            && hasScheduleConflict(newSchedule, existingSchedule)) {
                        conflictWarnings.add(
                                "Schedule conflict with "
                                + activeReg.getOffering().getCourse().getCourseCode()
                                + " - " + activeReg.getOffering().getSection()
                                + " (" + existingSchedule + ")");
                    }
                }
            }
        }

        // 7. Create the registration record
        CourseRegistration registration = new CourseRegistration();
        registration.setStudent(student);
        registration.setOffering(offering);
        registration.setStatus("Enrolled");
        registration.setRegisteredAt(LocalDateTime.now());

        CourseRegistration saved = registrationRepository.save(registration);
        log.info("Registration created: id={}, student={}, offering={}, status={}, warnings={}",
                saved.getRegistrationId(), username, offering.getOfferingId(),
                saved.getStatus(), conflictWarnings.size());

        return mapToEnrollmentResponse(saved, conflictWarnings);
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
        return mapToEnrollmentResponse(registration, java.util.Collections.emptyList());
    }

    /**
     * Maps a CourseRegistration entity to its response DTO, including schedule warnings.
     */
    private EnrollmentResponse mapToEnrollmentResponse(CourseRegistration registration,
                                                        List<String> warnings) {
        CourseOfferingResponse offeringDto = mapToOfferingResponse(registration.getOffering());

        return new EnrollmentResponse(
                registration.getRegistrationId(),
                registration.getStudent().getStudentId(),
                registration.getStatus(),
                registration.getRegisteredAt(),
                offeringDto,
                warnings
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

    // ── Schedule conflict helpers ──────────────────────────────

    /**
     * Checks whether two schedule strings overlap in both day and time.
     *
     * <p>Expected formats:</p>
     * <ul>
     *   <li>{@code "Mon/Wed 09:00 - 10:30"}</li>
     *   <li>{@code "Tue/Thu 11:00 - 12:30"}</li>
     *   <li>{@code "Fri 14:00 - 16:00"}</li>
     * </ul>
     *
     * @param schedule1 the new offering's schedule
     * @param schedule2 an existing registration's schedule
     * @return true if the schedules overlap in both day and time
     */
    private boolean hasScheduleConflict(String schedule1, String schedule2) {
        Set<String> days1 = extractDays(schedule1);
        Set<String> days2 = extractDays(schedule2);

        // If no common day, there is no conflict
        Set<String> commonDays = new HashSet<>(days1);
        commonDays.retainAll(days2);
        if (commonDays.isEmpty()) {
            return false;
        }

        // Check time range overlap
        int[] time1 = extractTimeRange(schedule1);
        int[] time2 = extractTimeRange(schedule2);

        if (time1 == null || time2 == null) {
            return false; // Cannot parse times — assume no conflict
        }

        // Two intervals overlap when: start1 < end2 AND start2 < end1
        return time1[0] < time2[1] && time2[0] < time1[1];
    }

    /**
     * Extracts day-of-week abbreviations from a schedule string.
     *
     * <p>Recognises standard 3-letter abbreviations:</p>
     * {@code Mon, Tue, Wed, Thu, Fri, Sat, Sun}.
     */
    private Set<String> extractDays(String schedule) {
        Set<String> days = new HashSet<>();
        if (schedule == null || schedule.isBlank()) return days;

        String[] parts = schedule.split("\\s+");
        for (String part : parts) {
            if (part.contains("/")) {
                days.addAll(Arrays.asList(part.split("/")));
            } else if (part.matches("^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$")) {
                days.add(part);
            }
        }
        return days;
    }

    /**
     * Extracts start and end time from a schedule string as minutes since midnight.
     *
     * <p>Matches patterns like {@code "09:00 - 10:30"} and returns
     * {@code [startMinutes, endMinutes]}, or {@code null} if no time range is found.</p>
     */
    private int[] extractTimeRange(String schedule) {
        if (schedule == null || schedule.isBlank()) return null;

        Pattern pattern = Pattern.compile("(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})");
        Matcher matcher = pattern.matcher(schedule);
        if (matcher.find()) {
            int startMinutes = Integer.parseInt(matcher.group(1)) * 60
                             + Integer.parseInt(matcher.group(2));
            int endMinutes = Integer.parseInt(matcher.group(3)) * 60
                           + Integer.parseInt(matcher.group(4));
            return new int[]{startMinutes, endMinutes};
        }
        return null;
    }
}
