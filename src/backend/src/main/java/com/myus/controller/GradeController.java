package com.myus.controller;

import com.myus.dto.GradeResponse;
import com.myus.security.IsStudent;
import com.myus.service.GradeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping("/me")
    @IsStudent
    public ResponseEntity<List<GradeResponse>> getMyGrades(Principal principal) {
        String username = principal.getName();
        log.debug("GET /api/v1/grades/me – username={}", username);

        return ResponseEntity.ok(gradeService.getMyGrades(username));
    }
}
