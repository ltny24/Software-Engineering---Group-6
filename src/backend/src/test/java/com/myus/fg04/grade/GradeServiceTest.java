package com.myus.fg04.grade;

import com.myus.dto.GradeResponse;
import com.myus.entity.Course;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
import com.myus.service.GradeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("FG04 – Grade Viewing: Service Layer Tests")
class GradeServiceTest {

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private GradeServiceImpl gradeService;

    private Student mockStudent;
    private Grade mockGrade1;

    @BeforeEach
    void setUp() {
        mockStudent = new Student();
        mockStudent.setStudentId(1L);
        mockStudent.setUsername("SV001");

        Course course1 = new Course();
        course1.setCourseId(1L);
        course1.setCourseCode("CS101");
        course1.setCourseName("Intro to CS");
        course1.setCredits(3);

        mockGrade1 = new Grade();
        mockGrade1.setGradeId(101L);
        mockGrade1.setStudent(mockStudent);
        mockGrade1.setCourse(course1);
        mockGrade1.setTerm("2024-HK1");
        mockGrade1.setGradeValue("A");
        mockGrade1.setGradePoint(new BigDecimal("4.0"));
    }

    @Test
    @DisplayName("TC_GRD_01: getMyGrades returns list of grades")
    void getMyGrades_returnsGrades() {
        when(studentRepository.findByUsername("SV001")).thenReturn(Optional.of(mockStudent));
        when(gradeRepository.findByStudentStudentId(1L)).thenReturn(List.of(mockGrade1));

        List<GradeResponse> responses = gradeService.getMyGrades("SV001");

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getGradeValue()).isEqualTo("A");
    }
}
