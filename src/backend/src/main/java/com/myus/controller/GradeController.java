package com.myus.controller;

import com.myus.dto.GradeOptionResponse;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.repository.GradeRepository;
import com.myus.repository.StudentRepository;
import com.myus.security.IsStudent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/me")
    @IsStudent
    public ResponseEntity<List<GradeOptionResponse>> getMyGrades(Principal principal) {
        Student student = studentRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        List<Grade> grades = gradeRepository.findByStudentStudentId(student.getStudentId());
        List<GradeOptionResponse> response = grades.stream().map(grade -> {
            GradeOptionResponse item = new GradeOptionResponse();
            item.setGradeId(grade.getGradeId());
            item.setCourseCode(grade.getCourse() != null ? grade.getCourse().getCourseCode() : null);
            item.setCourseName(grade.getCourse() != null ? grade.getCourse().getCourseName() : null);
            item.setCurrentGrade(grade.getGradeValue());
            item.setTerm(grade.getTerm());
            item.setIsFinalized(true);
            item.setIsEligibleForAppeal(true);
            return item;
        }).toList();

        return ResponseEntity.ok(response);
    }
}
