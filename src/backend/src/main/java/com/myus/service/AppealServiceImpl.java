package com.myus.service;

import com.myus.dto.AppealResponse;
import com.myus.dto.AppealReviewRequest;
import com.myus.dto.AppealSubmitRequest;
import com.myus.entity.Administrator;
import com.myus.entity.Appeal;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.exception.AppealException;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.AdministratorRepository;
import com.myus.repository.AppealRepository;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
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
        appeal.setSupportingDocumentUrl(request.getSupportingDocumentUrl());

        Appeal saved = appealRepository.save(appeal);
        log.info("Appeal submitted: appealId={}, studentId={}, gradeId={}",
                saved.getAppealId(), student.getStudentId(), grade.getGradeId());

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
}
