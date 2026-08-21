package com.myus.service;

import com.myus.dto.ClassTransferRecordResponse;
import com.myus.dto.ClassTransferRequestDto;
import com.myus.dto.ClassTransferResponse;
import com.myus.dto.CourseOfferingResponse;
import com.myus.dto.OfferingRosterResponse;
import com.myus.dto.RosterStudent;
import com.myus.dto.TransferFailure;
import com.myus.entity.AuditLog;
import com.myus.entity.ClassTransferRequest;
import com.myus.entity.CourseOffering;
import com.myus.entity.CourseRegistration;
import com.myus.entity.Student;
import com.myus.exception.ClassTransferException;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.AuditLogRepository;
import com.myus.repository.ClassTransferRequestRepository;
import com.myus.repository.CourseOfferingRepository;
import com.myus.repository.CourseRegistrationRepository;
import com.myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Default implementation of {@link ClassTransferService}.
 *
 * <p>Implements UC-14: move students between sections of the same course with
 * seat-availability and schedule-conflict validation, transactional updates,
 * a per-transfer audit record (administrator, timestamp, reason, override
 * flags), and an in-app notification to each affected student.</p>
 */
@Slf4j
@Service
public class ClassTransferServiceImpl implements ClassTransferService {

    private final StudentRepository studentRepository;
    private final CourseOfferingRepository offeringRepository;
    private final CourseRegistrationRepository registrationRepository;
    private final ClassTransferRequestRepository transferRepository;
    private final AuditLogRepository auditLogRepository;
    private final CourseService courseService;
    private final NotificationService notificationService;

    public ClassTransferServiceImpl(StudentRepository studentRepository,
                                    CourseOfferingRepository offeringRepository,
                                    CourseRegistrationRepository registrationRepository,
                                    ClassTransferRequestRepository transferRepository,
                                    AuditLogRepository auditLogRepository,
                                    CourseService courseService,
                                    NotificationService notificationService) {
        this.studentRepository = studentRepository;
        this.offeringRepository = offeringRepository;
        this.registrationRepository = registrationRepository;
        this.transferRepository = transferRepository;
        this.auditLogRepository = auditLogRepository;
        this.courseService = courseService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional(readOnly = true)
    public OfferingRosterResponse getRoster(Long offeringId) {
        CourseOffering source = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course offering not found with id: " + offeringId));

        OfferingRosterResponse response = new OfferingRosterResponse();
        response.setOffering(courseService.getOfferingById(offeringId));

        // Enrolled students (active registrations)
        List<RosterStudent> students = registrationRepository
                .findActiveByOfferingIdWithStudent(offeringId).stream()
                .map(reg -> new RosterStudent(
                        reg.getStudent().getStudentId(),
                        reg.getStudent().getUsername(),
                        fullName(reg.getStudent())))
                .toList();
        response.setStudents(students);

        // Candidate target sections: same course + same term, excluding source
        // and excluding cancelled sections.
        List<CourseOffering> sameCourseTerm = offeringRepository
                .findByCourseIdAndTermWithCourse(
                        source.getCourse().getCourseId(), source.getTerm());
        List<CourseOfferingResponse> targets = new ArrayList<>();
        for (CourseOffering target : sameCourseTerm) {
            if (target.getOfferingId().equals(source.getOfferingId())) {
                continue;
            }
            if ("Cancelled".equalsIgnoreCase(target.getStatus())) {
                continue;
            }
            targets.add(courseService.getOfferingById(target.getOfferingId()));
        }
        response.setTargets(targets);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassTransferRecordResponse> getTransferHistory() {
        return transferRepository.findAllWithDetails().stream()
                .map(this::toRecordResponse)
                .toList();
    }

    @Override
    @Transactional
    public ClassTransferResponse transferStudents(ClassTransferRequestDto request,
                                                  String adminUsername) {
        validateRequest(request);

        CourseOffering from = offeringRepository.findById(request.getFromOfferingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Source offering not found with id: " + request.getFromOfferingId()));
        CourseOffering to = offeringRepository.findById(request.getToOfferingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Target offering not found with id: " + request.getToOfferingId()));

        if (!from.getCourse().getCourseId().equals(to.getCourse().getCourseId())) {
            throw new ClassTransferException(
                    "Target section must belong to the same course as the source section.");
        }
        if ("Cancelled".equalsIgnoreCase(to.getStatus())) {
            throw new ClassTransferException(
                    "Target section has been cancelled and cannot receive transfers.");
        }

        ClassTransferResponse response = new ClassTransferResponse();
        for (Long studentId : request.getStudentIds()) {
            try {
                transferOne(studentId, from, to, request, adminUsername);
                response.setTransferredCount(response.getTransferredCount() + 1);
            } catch (ClassTransferException e) {
                String name = studentRepository.findById(studentId)
                        .map(this::fullName)
                        .orElseGet(() -> String.valueOf(studentId));
                response.getFailed().add(new TransferFailure(studentId, name, e.getMessage()));
                log.info("Transfer blocked for student {}: {}", studentId, e.getMessage());
            }
        }

        log.info("Class transfer completed: {} transferred, {} failed (from={} -> to={})",
                response.getTransferredCount(), response.getFailed().size(),
                request.getFromOfferingId(), request.getToOfferingId());

        return response;
    }

    @Override
    @Transactional
    public void cancelSection(Long offeringId) {
        CourseOffering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course offering not found with id: " + offeringId));
        offering.setStatus("Cancelled");
        offeringRepository.save(offering);
        log.info("Course offering {} ({}-{}) cancelled.",
                offeringId, offering.getCourse().getCourseCode(), offering.getSection());
    }

    // ── Per-student transfer ───────────────────────────────────

    private void transferOne(Long studentId, CourseOffering from, CourseOffering to,
                             ClassTransferRequestDto request, String adminUsername) {
        // 1. Source enrollment must exist and be active
        CourseRegistration registration = registrationRepository
                .findActiveByStudentAndOffering(studentId, from.getOfferingId())
                .orElseThrow(() -> new ClassTransferException(
                        "Student has no active enrollment in the source section."));

        // 2. Prevent duplicate enrollment in the target section
        registrationRepository.findActiveByStudentAndOffering(studentId, to.getOfferingId())
                .ifPresent(existing -> {
                    throw new ClassTransferException(
                            "Student is already enrolled in the target section.");
                });

        // 3. Seat availability (unless overridden)
        if (!request.isOverrideCapacity()) {
            long enrolled = registrationRepository.countActiveByOfferingId(to.getOfferingId());
            int capacity = to.getCourse().getCapacity() != null ? to.getCourse().getCapacity() : 0;
            if (capacity > 0 && enrolled >= capacity) {
                throw new ClassTransferException(
                        "Target section is full (capacity " + capacity + ").");
            }
        }

        // 4. Schedule conflict (unless overridden)
        if (!request.isOverrideConflict()) {
            List<CourseRegistration> others = registrationRepository
                    .findActiveByStudentIdWithOfferingAndCourse(studentId);
            for (CourseRegistration other : others) {
                if (other.getRegistrationId().equals(registration.getRegistrationId())) {
                    continue;
                }
                // Only enrollments in the SAME term can genuinely overlap in a
                // timetable. The mock data reuses the same time slots across
                // HKI/HKII/HKIII, so a cross-term course would otherwise be
                // falsely flagged as a conflict.
                if (!Objects.equals(to.getTerm(), other.getOffering().getTerm())) {
                    continue;
                }
                if (hasScheduleConflict(to.getSchedule(), other.getOffering().getSchedule())) {
                    throw new ClassTransferException(
                            "Schedule conflict with "
                            + other.getOffering().getCourse().getCourseCode()
                            + " - " + other.getOffering().getSection());
                }
            }
        }

        // 5. Reassign the enrollment to the target section
        registration.setOffering(to);
        registrationRepository.save(registration);

        // 6. Notify the affected student (UC-14 3.1.7)
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + studentId));
        String courseCode = to.getCourse().getCourseCode();
        notificationService.notifyStudent(studentId,
                "Class Transfer",
                "Your section for " + courseCode + " was changed from "
                        + from.getSection() + " to " + to.getSection()
                        + " by an administrator.");

        // 7. Record the transfer (audit trail: administrator, timestamp, reason, overrides)
        ClassTransferRequest audit = new ClassTransferRequest();
        audit.setStudent(student);
        audit.setFromOffering(from);
        audit.setToOffering(to);
        audit.setRequestDate(LocalDateTime.now());
        audit.setStatus("Approved");
        audit.setReviewerComments(request.getJustification());
        audit.setAdminUsername(adminUsername);
        audit.setOverrideCapacity(request.isOverrideCapacity());
        audit.setOverrideConflict(request.isOverrideConflict());
        transferRepository.save(audit);

        // 8. Generic audit-log entry for cross-cutting traceability (UC-11/UC-14)
        AuditLog auditLog = new AuditLog();
        auditLog.setAdminUsername(adminUsername);
        auditLog.setActionType("CLASS_TRANSFER");
        auditLog.setTargetEntity("CourseRegistration");
        auditLog.setTargetEntityId(String.valueOf(registration.getRegistrationId()));
        auditLog.setDetails("Moved " + courseCode + " from section " + from.getSection()
                + " to " + to.getSection()
                + (request.isOverrideCapacity() || request.isOverrideConflict()
                        ? " (overrides applied)" : ""));
        auditLogRepository.save(auditLog);
    }

    // ── Mapping helpers ────────────────────────────────────────

    private ClassTransferRecordResponse toRecordResponse(ClassTransferRequest t) {
        return new ClassTransferRecordResponse(
                t.getTransferId(),
                t.getStudent().getStudentId(),
                t.getStudent().getUsername(),
                fullName(t.getStudent()),
                t.getFromOffering().getOfferingId(),
                t.getFromOffering().getSection(),
                t.getToOffering().getOfferingId(),
                t.getToOffering().getSection(),
                t.getToOffering().getCourse().getCourseCode(),
                t.getToOffering().getCourse().getCourseName(),
                t.getRequestDate(),
                t.getStatus(),
                t.getReviewerComments()
        );
    }

    private String fullName(Student student) {
        StringBuilder sb = new StringBuilder();
        if (student.getFirstName() != null) sb.append(student.getFirstName()).append(' ');
        if (student.getMiddleName() != null) sb.append(student.getMiddleName()).append(' ');
        if (student.getLastName() != null) sb.append(student.getLastName());
        return sb.toString().trim();
    }

    private void validateRequest(ClassTransferRequestDto request) {
        if (request.getFromOfferingId() == null || request.getToOfferingId() == null) {
            throw new ClassTransferException("Source and target sections are required.");
        }
        if (request.getFromOfferingId().equals(request.getToOfferingId())) {
            throw new ClassTransferException("Source and target sections must be different.");
        }
        if (request.getStudentIds() == null || request.getStudentIds().isEmpty()) {
            throw new ClassTransferException("Select at least one student to transfer.");
        }
        // UC-14 AF4: any override of capacity/conflict checks requires a reason.
        if ((request.isOverrideCapacity() || request.isOverrideConflict())
                && (request.getJustification() == null || request.getJustification().isBlank())) {
            throw new ClassTransferException(
                    "A justification is required when overriding capacity or schedule-conflict checks.");
        }
    }

    // ── Schedule conflict detection (mirrors EnrollmentServiceImpl) ──

    private boolean hasScheduleConflict(String schedule1, String schedule2) {
        if (schedule1 == null || schedule2 == null) return false;
        String[] parts1 = schedule1.split("\\|");
        String[] parts2 = schedule2.split("\\|");

        for (String p1 : parts1) {
            for (String p2 : parts2) {
                if (hasSingleSessionConflict(p1.trim(), p2.trim())) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean hasSingleSessionConflict(String session1, String session2) {
        Set<String> days1 = extractDays(session1);
        Set<String> days2 = extractDays(session2);

        Set<String> commonDays = new HashSet<>(days1);
        commonDays.retainAll(days2);
        if (commonDays.isEmpty()) {
            return false;
        }

        int[] time1 = extractTimeRange(session1);
        int[] time2 = extractTimeRange(session2);
        if (time1 == null || time2 == null) {
            return false;
        }

        return time1[0] < time2[1] && time2[0] < time1[1];
    }

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
