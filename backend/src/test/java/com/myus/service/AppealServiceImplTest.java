package com.myus.service;

import com.myus.application.dto.AppealResponse;
import com.myus.application.dto.AppealReviewRequest;
import com.myus.application.dto.AppealSubmitRequest;
import com.myus.application.service.AppealServiceImpl;
import com.myus.domain.model.Administrator;
import com.myus.domain.model.Appeal;
import com.myus.domain.model.Course;
import com.myus.domain.model.Grade;
import com.myus.domain.model.Student;
import com.myus.domain.exception.AppealException;
import com.myus.domain.exception.ResourceNotFoundException;
import com.myus.domain.repository.AdministratorRepository;
import com.myus.domain.repository.AppealRepository;
import com.myus.domain.repository.GradeRepository;
import com.myus.domain.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppealServiceImplTest {

    @Mock
    private AppealRepository appealRepository;

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private AdministratorRepository administratorRepository;

    @InjectMocks
    private AppealServiceImpl appealService;

    private Student testStudent;
    private Grade testGrade;
    private Course testCourse;
    private Administrator testAdmin;

    @BeforeEach
    void setUp() {
        testStudent = new Student();
        testStudent.setStudentId(1L);
        testStudent.setUsername("student1");
        testStudent.setFirstName("Nguyen");
        testStudent.setLastName("Van A");

        testCourse = new Course();
        testCourse.setCourseId(10L);
        testCourse.setCourseCode("CS300");
        testCourse.setCourseName("Introduction to Software Engineering");

        testGrade = new Grade();
        testGrade.setGradeId(100L);
        testGrade.setStudent(testStudent);
        testGrade.setCourse(testCourse);
        testGrade.setGradeValue("C");
        testGrade.setTerm("2025-2026-HK2");

        testAdmin = new Administrator();
        testAdmin.setAdminId(50L);
        testAdmin.setUsername("admin1");
        testAdmin.setDisplayName("Admin User");
    }

    // ── Student: Submit Appeal ──────────────────────────────────

    @Nested
    @DisplayName("Submit Appeal")
    class SubmitAppealTests {

        @Test
        @DisplayName("Successfully submits an appeal")
        void submitAppealSuccessfully() {
            AppealSubmitRequest request = new AppealSubmitRequest(
                    100L, "I believe my exam was graded incorrectly.", null);

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(gradeRepository.findById(100L)).thenReturn(Optional.of(testGrade));
            when(appealRepository.existsByStudentStudentIdAndGradeGradeIdAndStatusNot(
                    1L, 100L, "Withdrawn")).thenReturn(false);
            when(appealRepository.save(any(Appeal.class))).thenAnswer(invocation -> {
                Appeal saved = invocation.getArgument(0);
                saved.setAppealId(200L);
                return saved;
            });

            AppealResponse response = appealService.submitAppeal("student1", request);

            assertThat(response.getAppealId()).isEqualTo(200L);
            assertThat(response.getStudentId()).isEqualTo(1L);
            assertThat(response.getStatus()).isEqualTo("Submitted");
            assertThat(response.getGradeId()).isEqualTo(100L);
            assertThat(response.getCourseCode()).isEqualTo("CS300");
            assertThat(response.getAppealReason()).isEqualTo("I believe my exam was graded incorrectly.");

            ArgumentCaptor<Appeal> captor = ArgumentCaptor.forClass(Appeal.class);
            verify(appealRepository).save(captor.capture());
            assertThat(captor.getValue().getSubmittedAt()).isNotNull();
        }

        @Test
        @DisplayName("Fails when grade does not exist")
        void submitAppealFailsGradeNotFound() {
            AppealSubmitRequest request = new AppealSubmitRequest(
                    999L, "Some valid reason for appeal.", null);

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(gradeRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> appealService.submitAppeal("student1", request))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Grade not found");

            verify(appealRepository, never()).save(any());
        }

        @Test
        @DisplayName("Fails when grade belongs to another student")
        void submitAppealFailsGradeNotOwned() {
            Student otherStudent = new Student();
            otherStudent.setStudentId(99L);
            otherStudent.setUsername("other_student");

            Grade otherGrade = new Grade();
            otherGrade.setGradeId(100L);
            otherGrade.setStudent(otherStudent);

            AppealSubmitRequest request = new AppealSubmitRequest(
                    100L, "Trying to appeal someone else's grade.", null);

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(gradeRepository.findById(100L)).thenReturn(Optional.of(otherGrade));

            assertThatThrownBy(() -> appealService.submitAppeal("student1", request))
                    .isInstanceOf(AppealException.class)
                    .hasMessageContaining("belong to you");

            verify(appealRepository, never()).save(any());
        }

        @Test
        @DisplayName("Fails when duplicate active appeal exists for same grade")
        void submitAppealFailsDuplicate() {
            AppealSubmitRequest request = new AppealSubmitRequest(
                    100L, "Duplicate appeal attempt for the same grade.", null);

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(gradeRepository.findById(100L)).thenReturn(Optional.of(testGrade));
            when(appealRepository.existsByStudentStudentIdAndGradeGradeIdAndStatusNot(
                    1L, 100L, "Withdrawn")).thenReturn(true);

            assertThatThrownBy(() -> appealService.submitAppeal("student1", request))
                    .isInstanceOf(AppealException.class)
                    .hasMessageContaining("active appeal already exists");

            verify(appealRepository, never()).save(any());
        }
    }

    // ── Student: Get My Appeals ─────────────────────────────────

    @Nested
    @DisplayName("Get My Appeals")
    class GetMyAppealsTests {

        @Test
        @DisplayName("Returns student's appeals ordered by submission date")
        void getMyAppealsReturnsStudentAppeals() {
            Appeal appeal1 = createTestAppeal(201L, "Submitted");
            Appeal appeal2 = createTestAppeal(202L, "Approved");

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(appealRepository.findByStudentStudentIdOrderBySubmittedAtDesc(1L))
                    .thenReturn(List.of(appeal1, appeal2));

            List<AppealResponse> responses = appealService.getMyAppeals("student1");

            assertThat(responses).hasSize(2);
            assertThat(responses.get(0).getAppealId()).isEqualTo(201L);
            assertThat(responses.get(1).getAppealId()).isEqualTo(202L);
        }

        @Test
        @DisplayName("Returns empty list when no appeals exist")
        void getMyAppealsReturnsEmptyList() {
            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(appealRepository.findByStudentStudentIdOrderBySubmittedAtDesc(1L))
                    .thenReturn(List.of());

            List<AppealResponse> responses = appealService.getMyAppeals("student1");

            assertThat(responses).isEmpty();
        }
    }

    // ── Student: Withdraw Appeal ────────────────────────────────

    @Nested
    @DisplayName("Withdraw Appeal")
    class WithdrawAppealTests {

        @Test
        @DisplayName("Successfully withdraws a 'Submitted' appeal")
        void withdrawAppealSuccessfully() {
            Appeal appeal = createTestAppeal(201L, "Submitted");

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(appealRepository.findByAppealIdAndStudentStudentId(201L, 1L))
                    .thenReturn(Optional.of(appeal));
            when(appealRepository.save(any(Appeal.class))).thenAnswer(i -> i.getArgument(0));

            AppealResponse response = appealService.withdrawAppeal("student1", 201L);

            assertThat(response.getStatus()).isEqualTo("Withdrawn");
            assertThat(response.getResolutionCode()).isEqualTo("WITHDRAWN_BY_STUDENT");
        }

        @Test
        @DisplayName("Fails to withdraw an appeal not in 'Submitted' status")
        void withdrawAppealFailsWrongStatus() {
            Appeal appeal = createTestAppeal(201L, "Under Review");

            when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(testStudent));
            when(appealRepository.findByAppealIdAndStudentStudentId(201L, 1L))
                    .thenReturn(Optional.of(appeal));

            assertThatThrownBy(() -> appealService.withdrawAppeal("student1", 201L))
                    .isInstanceOf(AppealException.class)
                    .hasMessageContaining("Only appeals in 'Submitted' status");

            verify(appealRepository, never()).save(any());
        }
    }

    // ── Admin: Review Appeal ────────────────────────────────────

    @Nested
    @DisplayName("Review Appeal (Admin)")
    class ReviewAppealTests {

        @Test
        @DisplayName("Successfully moves appeal from 'Submitted' to 'Under Review'")
        void reviewAppealSubmittedToUnderReview() {
            Appeal appeal = createTestAppeal(201L, "Submitted");
            AppealReviewRequest request = new AppealReviewRequest(
                    "Under Review", "We are investigating your case.", null);

            when(appealRepository.findById(201L)).thenReturn(Optional.of(appeal));
            when(administratorRepository.findByUsername("admin1")).thenReturn(Optional.of(testAdmin));
            when(appealRepository.save(any(Appeal.class))).thenAnswer(i -> i.getArgument(0));

            AppealResponse response = appealService.reviewAppeal(201L, "admin1", request);

            assertThat(response.getStatus()).isEqualTo("Under Review");
            assertThat(response.getReviewerComments()).isEqualTo("We are investigating your case.");
            assertThat(response.getResolvedAt()).isNull(); // not terminal
        }

        @Test
        @DisplayName("Successfully moves appeal from 'Under Review' to 'Approved'")
        void reviewAppealUnderReviewToApproved() {
            Appeal appeal = createTestAppeal(201L, "Under Review");
            LocalDateTime deadline = LocalDateTime.of(2026, 8, 1, 17, 0);
            AppealReviewRequest request = new AppealReviewRequest(
                    "Approved", "Grade has been corrected.", deadline);

            when(appealRepository.findById(201L)).thenReturn(Optional.of(appeal));
            when(administratorRepository.findByUsername("admin1")).thenReturn(Optional.of(testAdmin));
            when(appealRepository.save(any(Appeal.class))).thenAnswer(i -> i.getArgument(0));

            AppealResponse response = appealService.reviewAppeal(201L, "admin1", request);

            assertThat(response.getStatus()).isEqualTo("Approved");
            assertThat(response.getResolutionCode()).isEqualTo("APPROVED_BY_ADMIN");
            assertThat(response.getResolvedAt()).isNotNull();
            assertThat(response.getDeadline()).isEqualTo(deadline);
        }

        @Test
        @DisplayName("Successfully moves appeal from 'Under Review' to 'Denied'")
        void reviewAppealUnderReviewToDenied() {
            Appeal appeal = createTestAppeal(201L, "Under Review");
            AppealReviewRequest request = new AppealReviewRequest(
                    "Denied", "The original grade is correct after review.", null);

            when(appealRepository.findById(201L)).thenReturn(Optional.of(appeal));
            when(administratorRepository.findByUsername("admin1")).thenReturn(Optional.of(testAdmin));
            when(appealRepository.save(any(Appeal.class))).thenAnswer(i -> i.getArgument(0));

            AppealResponse response = appealService.reviewAppeal(201L, "admin1", request);

            assertThat(response.getStatus()).isEqualTo("Denied");
            assertThat(response.getResolutionCode()).isEqualTo("DENIED_BY_ADMIN");
            assertThat(response.getResolvedAt()).isNotNull();
        }

        @Test
        @DisplayName("Fails on invalid status transition (Submitted → Approved)")
        void reviewAppealFailsInvalidTransition() {
            Appeal appeal = createTestAppeal(201L, "Submitted");
            AppealReviewRequest request = new AppealReviewRequest(
                    "Approved", "Trying to skip Under Review.", null);

            when(appealRepository.findById(201L)).thenReturn(Optional.of(appeal));
            when(administratorRepository.findByUsername("admin1")).thenReturn(Optional.of(testAdmin));

            assertThatThrownBy(() -> appealService.reviewAppeal(201L, "admin1", request))
                    .isInstanceOf(AppealException.class)
                    .hasMessageContaining("Invalid status transition");

            verify(appealRepository, never()).save(any());
        }

        @Test
        @DisplayName("Fails on invalid status transition from terminal state (Denied → Under Review)")
        void reviewAppealFailsFromTerminalState() {
            Appeal appeal = createTestAppeal(201L, "Denied");
            AppealReviewRequest request = new AppealReviewRequest(
                    "Under Review", "Trying to reopen denied appeal.", null);

            when(appealRepository.findById(201L)).thenReturn(Optional.of(appeal));
            when(administratorRepository.findByUsername("admin1")).thenReturn(Optional.of(testAdmin));

            assertThatThrownBy(() -> appealService.reviewAppeal(201L, "admin1", request))
                    .isInstanceOf(AppealException.class)
                    .hasMessageContaining("Invalid status transition");

            verify(appealRepository, never()).save(any());
        }
    }

    // ── Admin: Get All Appeals ──────────────────────────────────

    @Nested
    @DisplayName("Get All Appeals (Admin)")
    class GetAllAppealsTests {

        @Test
        @DisplayName("Returns all appeals when no status filter")
        void getAllAppealsNoFilter() {
            Appeal appeal1 = createTestAppeal(201L, "Submitted");
            Appeal appeal2 = createTestAppeal(202L, "Under Review");

            when(appealRepository.findAllByOrderBySubmittedAtDesc())
                    .thenReturn(List.of(appeal1, appeal2));

            List<AppealResponse> responses = appealService.getAllAppeals(null);

            assertThat(responses).hasSize(2);
        }

        @Test
        @DisplayName("Returns filtered appeals by status")
        void getAllAppealsWithFilter() {
            Appeal appeal = createTestAppeal(201L, "Submitted");

            when(appealRepository.findByStatusOrderBySubmittedAtDesc("Submitted"))
                    .thenReturn(List.of(appeal));

            List<AppealResponse> responses = appealService.getAllAppeals("Submitted");

            assertThat(responses).hasSize(1);
            assertThat(responses.get(0).getStatus()).isEqualTo("Submitted");
        }
    }

    // ── Helper ──────────────────────────────────────────────────

    private Appeal createTestAppeal(Long appealId, String status) {
        Appeal appeal = new Appeal();
        appeal.setAppealId(appealId);
        appeal.setStudent(testStudent);
        appeal.setGrade(testGrade);
        appeal.setSubmittedAt(LocalDateTime.now());
        appeal.setStatus(status);
        appeal.setAppealReason("Test appeal reason for unit testing.");
        return appeal;
    }
}
