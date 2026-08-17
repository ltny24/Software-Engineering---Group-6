package com.myus.fg02.appeal;

import com.myus.dto.AppealResponse;
import com.myus.dto.AppealSubmitRequest;
import com.myus.entity.Appeal;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.entity.Course;
import com.myus.exception.AppealException;
import com.myus.repository.AppealRepository;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
import com.myus.service.AppealServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FG02 – Submit Grade Appeal: Service Layer Tests")
class GradeAppealServiceTest {

    @Mock
    private AppealRepository appealRepository;
    @Mock
    private GradeRepository gradeRepository;
    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private AppealServiceImpl appealService;

    private Student mockStudent;
    private Grade mockGrade;

    @BeforeEach
    void setUp() {
        mockStudent = new Student();
        mockStudent.setStudentId(1L);
        mockStudent.setUsername("SV001");

        Course mockCourse = new Course();
        mockCourse.setCourseName("Toán rời rạc");

        mockGrade = new Grade();
        mockGrade.setGradeId(101L);
        mockGrade.setStudent(mockStudent);
        mockGrade.setCourse(mockCourse);
        mockGrade.setGradePoint(new BigDecimal("6.5"));
    }

    @Test
    @DisplayName("TC_APP_SUB_01: submit valid appeal returns success")
    void submitAppeal_valid_returnsSuccess() {
        AppealSubmitRequest request = new AppealSubmitRequest();
        request.setGradeId(101L);
        request.setAppealReason("Chấm sai điểm câu 2");

        when(studentRepository.findByUsername("SV001")).thenReturn(Optional.of(mockStudent));
        when(gradeRepository.findById(101L)).thenReturn(Optional.of(mockGrade));
        when(appealRepository.existsByStudentStudentIdAndGradeGradeIdAndStatusNot(anyLong(), anyLong(), eq("Withdrawn"))).thenReturn(false);
        
        Appeal saved = new Appeal();
        saved.setAppealId(1L);
        saved.setStatus("Submitted");
        saved.setStudent(mockStudent);
        saved.setGrade(mockGrade);
        when(appealRepository.save(any(Appeal.class))).thenReturn(saved);

        AppealResponse response = appealService.submitAppeal("SV001", request);
        assertThat(response.getStatus()).isEqualTo("Submitted");
    }
}
