package com.myus.service;

import com.myus.dto.GradeResponse;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));

        List<Grade> grades = gradeRepository.findByStudentStudentId(student.getStudentId());

        return grades.stream()
                .sorted(Comparator.comparing(Grade::getTerm, Comparator.nullsLast(String::compareTo))
                        .thenComparing(Grade::getGradeId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private GradeResponse mapToResponse(Grade grade) {
        return new GradeResponse(
                grade.getGradeId(),
                grade.getTerm(),
                grade.getCourse() != null ? grade.getCourse().getCourseCode() : null,
                grade.getCourse() != null ? grade.getCourse().getCourseName() : null,
                grade.getCourse() != null ? grade.getCourse().getCredits() : null,
                grade.getGradeValue(),
                grade.getGradePoint(),
                grade.getGradePoint()
        );
    }
}
