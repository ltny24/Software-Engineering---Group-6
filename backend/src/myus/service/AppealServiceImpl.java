package myus.service;

import myus.dto.AppealResponse;
import myus.dto.AppealReviewRequest;
import myus.dto.AppealSubmitRequest;
import myus.entity.Administrator;
import myus.entity.Appeal;
import myus.entity.Grade;
import myus.entity.Student;
import myus.exception.AppealException;
import myus.exception.ResourceNotFoundException;
import myus.repository.AdministratorRepository;
import myus.repository.AppealRepository;
import myus.repository.GradeRepository;
import myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of {@link AppealService} providing the full
 * grade appeal workflow for both students and administrators.
 *
 * <p>Business rules enforced:</p>
 * <ul>
 *   <li>A student cannot submit duplicate appeals for the same grade</li>
 *   <li>Only the grade owner can submit an appeal</li>
 *   <li>Only appeals in "Submitted" status can be withdrawn</li>
 *   <li>Status transitions are validated:
 *       Submitted → Under Review → Approved/Denied</li>
 * </ul>
 */
@Slf4j
@Service
@Transactional
public class AppealServiceImpl implements AppealService {

    /** Valid status transitions: key = current status, value = allowed next statuses. */
    private static final Map<String, Set<String>> VALID_TRANSITIONS = Map.of(
            "Submitted", Set.of("Under Review", "Denied"),
            "Under Review", Set.of("Approved", "Denied")
    );

    private final AppealRepository appealRepository;
    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final AdministratorRepository administratorRepository;

    public AppealServiceImpl(AppealRepository appealRepository,
                             GradeRepository gradeRepository,
                             StudentRepository studentRepository,
                             AdministratorRepository administratorRepository) {
        this.appealRepository = appealRepository;
        this.gradeRepository = gradeRepository;
        this.studentRepository = studentRepository;
        this.administratorRepository = administratorRepository;
    }

    // ── Student Operations ──────────────────────────────────────

    @Override
    public AppealResponse submitAppeal(String username, AppealSubmitRequest request) {
        Student student = findStudentByUsername(username);

        // Validate that the grade exists
        Grade grade = gradeRepository.findById(request.getGradeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Grade not found with ID: " + request.getGradeId()));

        // Validate that the grade belongs to the student
        if (!grade.getStudent().getStudentId().equals(student.getStudentId())) {
            throw new AppealException("You can only appeal grades that belong to you.");
        }

        // Check for duplicate active appeal on the same grade
        boolean duplicateExists = appealRepository
                .existsByStudentStudentIdAndGradeGradeIdAndStatusNot(
                        student.getStudentId(), grade.getGradeId(), "Withdrawn");
        if (duplicateExists) {
            throw new AppealException(
                    "An active appeal already exists for this grade. "
                    + "You must withdraw the existing appeal before submitting a new one.");
        }

        // Create the appeal
        Appeal appeal = new Appeal();
        appeal.setStudent(student);
        appeal.setGrade(grade);
        appeal.setSubmittedAt(LocalDateTime.now());
        appeal.setStatus("Submitted");
        appeal.setAppealReason(request.getAppealReason());
        appeal.setExpectedGrade(request.getExpectedGrade());
        appeal.setDeadline(LocalDateTime.now().plusHours(72));
        appeal.setSupportingDocumentUrl(
                (request.getSupportingDocumentUrl() != null && !request.getSupportingDocumentUrl().isBlank())
                        ? request.getSupportingDocumentUrl()
                        : "https://ktdbcl.hcmus.edu.vn/");

        Appeal saved = appealRepository.save(appeal);
        log.info("Appeal submitted: appealId={}, studentId={}, gradeId={}, expectedGrade={}",
                saved.getAppealId(), student.getStudentId(), grade.getGradeId(), request.getExpectedGrade());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppealResponse> getMyAppeals(String username) {
        Student student = findStudentByUsername(username);
        List<Appeal> appeals = appealRepository
                .findByStudentStudentIdOrderBySubmittedAtDesc(student.getStudentId());
        return appeals.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<myus.dto.appeal.AppealSummaryResponse> getStudentAppeals(String username) {
        Student student = findStudentByUsername(username);
        List<Appeal> appeals = appealRepository
                .findByStudentStudentIdOrderBySubmittedAtDesc(student.getStudentId());
        checkAndCancelExpiredAppeals(appeals);
        return appeals.stream().map(this::mapToSummaryResponse).collect(Collectors.toList());
    }

    @Override
    public myus.dto.appeal.AppealDetailResponse getAppealDetailByCode(String trackingCode, String username) {
        Student student = findStudentByUsername(username);
        Long appealId;
        try {
            if (trackingCode != null && trackingCode.startsWith("APL-")) {
                appealId = Long.parseLong(trackingCode.replace("APL-", ""));
            } else if (trackingCode != null) {
                appealId = Long.parseLong(trackingCode);
            } else {
                throw new ResourceNotFoundException("Tracking code cannot be empty.");
            }
        } catch (NumberFormatException e) {
            throw new ResourceNotFoundException("Invalid tracking code: " + trackingCode);
        }

        Appeal appeal = appealRepository
                .findByAppealIdAndStudentStudentId(appealId, student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appeal not found for code: " + trackingCode));

        checkAndCancelExpiredAppeals(List.of(appeal));
        return mapToDetailResponse(appeal);
    }

    @Override
    @Transactional(readOnly = true)
    public AppealResponse getAppealById(String username, Long appealId) {
        Student student = findStudentByUsername(username);
        Appeal appeal = appealRepository
                .findByAppealIdAndStudentStudentId(appealId, student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appeal not found with ID: " + appealId));
        return mapToResponse(appeal);
    }

    @Override
    public AppealResponse withdrawAppeal(String username, Long appealId) {
        Student student = findStudentByUsername(username);
        Appeal appeal = appealRepository
                .findByAppealIdAndStudentStudentId(appealId, student.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appeal not found with ID: " + appealId));

        if (!"Submitted".equals(appeal.getStatus())) {
            throw new AppealException(
                    "Only appeals in 'Submitted' status can be withdrawn. "
                    + "Current status: " + appeal.getStatus());
        }

        appeal.setStatus("Withdrawn");
        appeal.setResolvedAt(LocalDateTime.now());
        appeal.setResolutionCode("WITHDRAWN_BY_STUDENT");

        Appeal updated = appealRepository.save(appeal);
        log.info("Appeal withdrawn: appealId={}, studentId={}", appealId, student.getStudentId());

        return mapToResponse(updated);
    }

    // ── Administrator Operations ────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<AppealResponse> getAllAppeals(String statusFilter) {
        List<Appeal> appeals;
        if (statusFilter != null && !statusFilter.isBlank()) {
            appeals = appealRepository.findByStatusOrderBySubmittedAtDesc(statusFilter);
        } else {
            appeals = appealRepository.findAllByOrderBySubmittedAtDesc();
        }
        return appeals.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AppealResponse getAppealByIdAdmin(Long appealId) {
        Appeal appeal = appealRepository.findById(appealId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appeal not found with ID: " + appealId));
        return mapToResponse(appeal);
    }

    @Override
    public AppealResponse reviewAppeal(Long appealId, String adminUsername,
                                       AppealReviewRequest request) {
        Appeal appeal = appealRepository.findById(appealId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Appeal not found with ID: " + appealId));

        Administrator admin = administratorRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Administrator not found: " + adminUsername));

        // Validate status transition
        String currentStatus = appeal.getStatus();
        String newStatus = request.getStatus();
        Set<String> allowed = VALID_TRANSITIONS.get(currentStatus);

        if (allowed == null || !allowed.contains(newStatus)) {
            throw new AppealException(
                    "Invalid status transition from '" + currentStatus
                    + "' to '" + newStatus + "'. "
                    + "Allowed transitions: "
                    + (allowed != null ? allowed : "none (appeal is in a terminal state)"));
        }

        // Apply the review
        appeal.setStatus(newStatus);
        appeal.setReviewerAdmin(admin);

        if (request.getReviewerComments() != null) {
            appeal.setReviewerComments(request.getReviewerComments());
        }

        if (request.getDeadline() != null) {
            appeal.setDeadline(request.getDeadline());
        }

        // If the status is terminal (Approved/Denied), set resolution fields
        if ("Approved".equals(newStatus) || "Denied".equals(newStatus)) {
            appeal.setResolvedAt(LocalDateTime.now());
            appeal.setResolutionCode(newStatus.toUpperCase() + "_BY_ADMIN");
        }

        Appeal updated = appealRepository.save(appeal);
        log.info("Appeal reviewed: appealId={}, adminId={}, newStatus={}",
                appealId, admin.getAdminId(), newStatus);

        return mapToResponse(updated);
    }

    // ── Helper Methods ──────────────────────────────────────────

    private Student findStudentByUsername(String username) {
        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));
    }

    /**
     * Maps an {@link Appeal} entity to an {@link AppealResponse} DTO.
     * Includes denormalized grade and course information.
     */
    private AppealResponse mapToResponse(Appeal appeal) {
        AppealResponse response = new AppealResponse();
        response.setAppealId(appeal.getAppealId());
        response.setStudentId(appeal.getStudent().getStudentId());
        response.setStudentName(
                appeal.getStudent().getFirstName() + " " + appeal.getStudent().getLastName());
        response.setSubmittedAt(appeal.getSubmittedAt());
        response.setStatus(appeal.getStatus());
        response.setAppealReason(appeal.getAppealReason());
        response.setSupportingDocumentUrl(appeal.getSupportingDocumentUrl());
        response.setReviewerComments(appeal.getReviewerComments());
        response.setDeadline(appeal.getDeadline());
        response.setResolvedAt(appeal.getResolvedAt());
        response.setResolutionCode(appeal.getResolutionCode());

        // Include grade and course info if grade is available
        if (appeal.getGrade() != null) {
            Grade grade = appeal.getGrade();
            response.setGradeId(grade.getGradeId());
            response.setGradeValue(grade.getGradeValue());

            if (grade.getCourse() != null) {
                response.setCourseCode(grade.getCourse().getCourseCode());
                response.setCourseName(grade.getCourse().getCourseName());
            }
        }

        return response;
    }

    private void checkAndCancelExpiredAppeals(List<Appeal> appeals) {
        LocalDateTime now = LocalDateTime.now();
        for (Appeal appeal : appeals) {
            if ("PENDING".equalsIgnoreCase(appeal.getStatus()) || "Submitted".equalsIgnoreCase(appeal.getStatus())) {
                if (appeal.getDeadline() != null && appeal.getDeadline().isBefore(now)) {
                    appeal.setStatus("CANCELED");
                    appeal.setResolutionCode("CANCELED_FEE_OVERDUE");
                    appealRepository.save(appeal);
                }
            }
        }
    }

    private myus.dto.appeal.AppealSummaryResponse mapToSummaryResponse(Appeal appeal) {
        myus.dto.appeal.AppealSummaryResponse res = new myus.dto.appeal.AppealSummaryResponse();
        res.setAppealId(appeal.getAppealId());
        res.setTrackingCode("APL-" + String.format("%06d", appeal.getAppealId()));
        res.setCreatedAt(appeal.getSubmittedAt() != null ? appeal.getSubmittedAt() : LocalDateTime.now());

        String status = appeal.getStatus();
        if ("Submitted".equalsIgnoreCase(status)) status = "PENDING";
        else if ("Under Review".equalsIgnoreCase(status)) status = "PROCESSING";
        else if ("Approved".equalsIgnoreCase(status)) status = "RESOLVED";
        else if ("Denied".equalsIgnoreCase(status)) status = "REJECTED";
        else if ("Withdrawn".equalsIgnoreCase(status)) status = "CANCELED";
        res.setStatus(status);

        if (appeal.getGrade() != null) {
            Grade g = appeal.getGrade();
            res.setExamType("Final Exam");
            if (g.getGradePoint() != null) {
                res.setCurrentGrade(g.getGradePoint().doubleValue());
            } else if (g.getGradePoint() != null) {
                res.setCurrentGrade(g.getGradePoint().doubleValue());
            } else {
                res.setCurrentGrade(8.0);
            }

            if (appeal.getExpectedGrade() != null) {
                res.setExpectedGrade(appeal.getExpectedGrade());
            } else {
                res.setExpectedGrade(res.getCurrentGrade());
            }

            if (g.getCourse() != null) {
                res.setCourseCode(g.getCourse().getCourseCode());
                res.setCourseName(g.getCourse().getCourseName());
            } else {
                res.setCourseCode("CSC10009");
                res.setCourseName("Computer Systems");
            }
        } else {
            res.setExamType("Final Exam");
            res.setCurrentGrade(8.0);
            res.setExpectedGrade(appeal.getExpectedGrade() != null ? appeal.getExpectedGrade() : 8.0);
            res.setCourseCode("CSC10009");
            res.setCourseName("Computer Systems");
        }

        res.setFeeStatus("PENDING".equals(status) ? "UNPAID" : "PAID");
        res.setFeePaymentDeadline(appeal.getDeadline() != null ? appeal.getDeadline() : (appeal.getSubmittedAt() != null ? appeal.getSubmittedAt().plusHours(72) : LocalDateTime.now().plusHours(72)));
        return res;
    }

    private myus.dto.appeal.AppealDetailResponse mapToDetailResponse(Appeal appeal) {
        myus.dto.appeal.AppealSummaryResponse summary = mapToSummaryResponse(appeal);
        myus.dto.appeal.AppealDetailResponse detail = new myus.dto.appeal.AppealDetailResponse();

        detail.setAppealId(summary.getAppealId());
        detail.setTrackingCode(summary.getTrackingCode());
        detail.setCourseCode(summary.getCourseCode());
        detail.setCourseName(summary.getCourseName());
        detail.setExamType(summary.getExamType());
        detail.setCurrentGrade(summary.getCurrentGrade());
        detail.setExpectedGrade(summary.getExpectedGrade());
        detail.setStatus(summary.getStatus());
        detail.setFeeStatus(summary.getFeeStatus());
        detail.setFeePaymentDeadline(summary.getFeePaymentDeadline());
        detail.setCreatedAt(summary.getCreatedAt());

        detail.setReason(appeal.getAppealReason() != null ? appeal.getAppealReason() : "No detailed reason provided.");
        detail.setReviewerComments(appeal.getReviewerComments() != null ? appeal.getReviewerComments() : "Pending administrative review.");
        detail.setUpdatedGrade("RESOLVED".equals(summary.getStatus()) ? summary.getExpectedGrade() : null);
        detail.setResolvedAt(appeal.getResolvedAt());
        detail.setAttachments(appeal.getSupportingDocumentUrl() != null ? java.util.List.of(appeal.getSupportingDocumentUrl()) : java.util.List.of());

        return detail;
    }
}
