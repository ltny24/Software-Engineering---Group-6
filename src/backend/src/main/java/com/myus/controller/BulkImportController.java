package com.myus.controller;

import com.myus.dto.CourseImportPreviewResponse;
import com.myus.dto.CourseImportRequest;
import com.myus.dto.CourseImportResponse;
import com.myus.dto.StudentImportPreviewResponse;
import com.myus.dto.StudentImportRequest;
import com.myus.dto.StudentImportResponse;
import com.myus.security.IsAdministrator;
import com.myus.service.BulkImportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

/**
 * REST controller for administrator bulk data import (FR-008 / UC-11a).
 *
 * <p>All endpoints require the {@code ADMINISTRATOR} role via
 * {@link IsAdministrator}.</p>
 *
 * <p>API contract (each data type follows a preview → confirm flow):</p>
 * <ul>
 *   <li>{@code POST /api/admin/import/students/preview} – validate an uploaded student file</li>
 *   <li>{@code POST /api/admin/import/students/confirm} – apply approved student rows</li>
 *   <li>{@code POST /api/admin/import/courses/preview} – validate an uploaded course file</li>
 *   <li>{@code POST /api/admin/import/courses/confirm} – apply approved course rows</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/import")
public class BulkImportController {

    private final BulkImportService bulkImportService;

    public BulkImportController(BulkImportService bulkImportService) {
        this.bulkImportService = bulkImportService;
    }

    @PostMapping("/students/preview")
    @IsAdministrator
    public ResponseEntity<StudentImportPreviewResponse> previewStudents(
            @RequestParam("file") MultipartFile file) {
        log.debug("POST /api/admin/import/students/preview – file={}, size={}",
                file.getOriginalFilename(), file.getSize());
        return ResponseEntity.ok(bulkImportService.previewStudents(file));
    }

    @PostMapping("/students/confirm")
    @IsAdministrator
    public ResponseEntity<StudentImportResponse> importStudents(
            @RequestBody StudentImportRequest request,
            Principal principal) {
        log.debug("POST /api/admin/import/students/confirm – rows={}",
                request.getRows() != null ? request.getRows().size() : 0);
        return ResponseEntity.ok(bulkImportService.importStudents(request, principal.getName()));
    }

    @PostMapping("/courses/preview")
    @IsAdministrator
    public ResponseEntity<CourseImportPreviewResponse> previewCourses(
            @RequestParam("file") MultipartFile file) {
        log.debug("POST /api/admin/import/courses/preview – file={}, size={}",
                file.getOriginalFilename(), file.getSize());
        return ResponseEntity.ok(bulkImportService.previewCourses(file));
    }

    @PostMapping("/courses/confirm")
    @IsAdministrator
    public ResponseEntity<CourseImportResponse> importCourses(
            @RequestBody CourseImportRequest request,
            Principal principal) {
        log.debug("POST /api/admin/import/courses/confirm – rows={}",
                request.getRows() != null ? request.getRows().size() : 0);
        return ResponseEntity.ok(bulkImportService.importCourses(request, principal.getName()));
    }
}
