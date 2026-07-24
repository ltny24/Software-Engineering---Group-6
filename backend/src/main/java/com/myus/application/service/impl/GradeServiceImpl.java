package com.myus.application.service.impl;

import com.myus.application.dto.GradeResponse;
import com.myus.application.service.GradeService;
import com.myus.domain.exception.ResourceNotFoundException;
import com.myus.domain.model.Grade;
import com.myus.domain.model.Student;
import com.myus.domain.repository.GradeRepository;
import com.myus.domain.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Default implementation for grade query operations.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class GradeServiceImpl implements GradeService {

    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public GradeServiceImpl(StudentRepository studentRepository,
                            GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }

    @Override
    public List<GradeResponse> getMyGrades(String username) {
        log.debug("Fetching grades for username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));

        List<Grade> grades = gradeRepository.findByStudentStudentId(student.getStudentId());
        log.debug("Found {} grade records for student id={}", grades.size(), student.getStudentId());

        return grades.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GradeResponse mapToResponse(Grade grade) {
        String courseCode = grade.getCourse() != null ? grade.getCourse().getCourseCode() : null;
        String courseName = grade.getCourse() != null ? grade.getCourse().getCourseName() : null;
        Integer credits = grade.getCourse() != null ? grade.getCourse().getCredits() : 0;

        // overallScore mirrors gradePoint for now (backend doesn't store a separate overall score)
        BigDecimal overallScore = grade.getGradePoint() != null
                ? grade.getGradePoint().multiply(BigDecimal.TEN)
                : BigDecimal.ZERO;

        return new GradeResponse(
                grade.getGradeId(),
                grade.getTerm(),
                courseCode,
                courseName,
                credits,
                grade.getGradeValue(),
                grade.getGradePoint(),
                overallScore
        );
    }
}
