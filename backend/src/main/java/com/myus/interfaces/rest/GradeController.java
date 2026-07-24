package com.myus.interfaces.rest;

import com.myus.application.dto.GradeResponse;
import com.myus.application.service.GradeService;
import com.myus.infrastructure.security.IsStudent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * REST controller for student grade operations.
 *
 * <p>All endpoints require the {@code STUDENT} role.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    /**
     * Retrieve all grades for the authenticated student.
     *
     * @param principal the authenticated principal (injected from JWT)
     * @return list of grade response DTOs
     */
    @GetMapping("/me")
    @IsStudent
    public ResponseEntity<List<GradeResponse>> getMyGrades(Principal principal) {
        String username = principal.getName();
        log.debug("GET /api/v1/grades/me – username={}", username);

        List<GradeResponse> grades = gradeService.getMyGrades(username);
        return ResponseEntity.ok(grades);
    }
}
