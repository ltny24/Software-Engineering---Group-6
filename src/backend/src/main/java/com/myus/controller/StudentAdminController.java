package com.myus.controller;

import com.myus.dto.StudentProfileResponse;
import com.myus.security.IsAdministrator;
import com.myus.service.StudentAdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * REST controller for administrator student data administration (UC-17, UC-18).
 *
 * <p>All endpoints require the {@code ADMINISTRATOR} role via {@link IsAdministrator}.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code GET /api/admin/students/search} – search students with optional keyword, major, status filters (paginated)</li>
 *   <li>{@code GET /api/admin/students/{id}}    – get permitted student details; triggers audit log</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/students")
public class StudentAdminController {

    private final StudentAdminService studentAdminService;

    public StudentAdminController(StudentAdminService studentAdminService) {
        this.studentAdminService = studentAdminService;
    }

    @GetMapping("/search")
    @IsAdministrator
    public ResponseEntity<Page<StudentProfileResponse>> searchStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String enrollmentStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        log.debug("GET /api/admin/students/search – keyword={}, major={}, status={}, page={}",
                keyword, major, enrollmentStatus, page);

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<StudentProfileResponse> result = studentAdminService.searchStudents(keyword, major, enrollmentStatus, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @IsAdministrator
    public ResponseEntity<StudentProfileResponse> getStudentDetails(
            @PathVariable Long id,
            Principal principal) {

        String adminUsername = principal.getName();
        log.debug("GET /api/admin/students/{} – admin={}", id, adminUsername);

        StudentProfileResponse response = studentAdminService.getStudentDetails(id, adminUsername);
        return ResponseEntity.ok(response);
    }
}
