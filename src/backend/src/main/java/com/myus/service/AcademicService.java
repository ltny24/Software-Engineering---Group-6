package com.myus.service;

import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
public class AcademicService {

    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public AcademicService(StudentRepository studentRepository,
                           GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }

    public List<Grade> getStudentGrades(String username) {
        Student student = findStudentByUsername(username);
        return gradeRepository.findByStudentStudentIdOrderByTermAscGradeIdAsc(student.getStudentId());
    }

    public BigDecimal calculateGPA(String username) {
        Student student = findStudentByUsername(username);

        List<Grade> grades = gradeRepository.findByStudentStudentIdOrderByTermAscGradeIdAsc(student.getStudentId());

        BigDecimal totalQualityPoints = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (Grade grade : grades) {
            if (grade.getGradePoint() == null || grade.getCourse() == null || grade.getCourse().getCredits() == null) {
                continue;
            }

            BigDecimal credits = BigDecimal.valueOf(grade.getCourse().getCredits());
            totalQualityPoints = totalQualityPoints.add(grade.getGradePoint().multiply(credits));
            totalCredits = totalCredits.add(credits);
        }

        if (totalCredits.compareTo(BigDecimal.ZERO) == 0) {
            log.debug("No graded credits found for student username={}", username);
            return BigDecimal.ZERO.setScale(3, RoundingMode.DOWN);
        }

        BigDecimal gpa = totalQualityPoints.divide(totalCredits, 6, RoundingMode.DOWN)
                .setScale(3, RoundingMode.DOWN);
        log.debug("Calculated GPA for student username={} => {}", username, gpa);
        return gpa;
    }

    private Student findStudentByUsername(String username) {
        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));
    }
}
