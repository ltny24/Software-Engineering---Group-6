package com.myus.service;

import com.myus.entity.Course;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.AcademicRecordRepository;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

class AcademicServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private AcademicRecordRepository academicRecordRepository;

    @InjectMocks
    private AcademicService academicService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void calculateGpaUsesCreditsAndGradePoints() {
        Student student = new Student();
        student.setStudentId(1L);
        student.setUsername("student");

        Course math = new Course();
        math.setCourseId(10L);
        math.setCredits(3);

        Course science = new Course();
        science.setCourseId(11L);
        science.setCredits(4);

        Grade mathGrade = new Grade();
        mathGrade.setGradePoint(new BigDecimal("4.00"));
        mathGrade.setCourse(math);

        Grade scienceGrade = new Grade();
        scienceGrade.setGradePoint(new BigDecimal("3.00"));
        scienceGrade.setCourse(science);

        when(studentRepository.findByUsername("student")).thenReturn(Optional.of(student));
        when(gradeRepository.findByStudentStudentIdOrderByTermAscGradeIdAsc(1L)).thenReturn(List.of(mathGrade, scienceGrade));

        BigDecimal gpa = academicService.calculateGPA("student");

        assertEquals(new BigDecimal("3.428"), gpa);
    }

    @Test
    void getStudentGradesReturnsOnlyTheMatchingStudentGrades() {
        Student student = new Student();
        student.setStudentId(2L);
        student.setUsername("student");

        Grade grade = new Grade();
        grade.setGradeId(99L);
        grade.setGradeValue("A");
        grade.setStudent(student);

        when(studentRepository.findByUsername("student")).thenReturn(Optional.of(student));
        when(gradeRepository.findByStudentStudentIdOrderByTermAscGradeIdAsc(2L)).thenReturn(List.of(grade));

        List<Grade> grades = academicService.getStudentGrades("student");

        assertEquals(1, grades.size());
        assertEquals(99L, grades.get(0).getGradeId());
    }

    @Test
    void missingStudentThrowsResourceNotFoundException() {
        when(studentRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> academicService.calculateGPA("unknown"));
    }
}
