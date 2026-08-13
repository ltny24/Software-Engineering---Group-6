package com.myus.controller;

import com.myus.dto.ScheduleImportRequest;
import com.myus.dto.ScheduleImportResponse;
import com.myus.dto.SchedulePreviewResponse;
import com.myus.security.IsAdministrator;
import com.myus.service.ScheduleImportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller for master-schedule upload (FG7 / UC-11, UC-11a, UC-11b).
 *
 * <p>All endpoints require the {@code ADMINISTRATOR} role via
 * {@link IsAdministrator}.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code POST /api/admin/schedule-upload/preview} – validate an uploaded CSV</li>
 *   <li>{@code POST /api/admin/schedule-upload/import} – apply approved rows</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/schedule-upload")
public class ScheduleUploadController {

    private final ScheduleImportService scheduleImportService;

    public ScheduleUploadController(ScheduleImportService scheduleImportService) {
        this.scheduleImportService = scheduleImportService;
    }

    /**
     * Validate an uploaded master-schedule CSV and return a preview.
     *
     * @param file the uploaded CSV file
     * @return preview of valid and invalid rows
     */
    @PostMapping("/preview")
    @IsAdministrator
    public ResponseEntity<SchedulePreviewResponse> preview(@RequestParam("file") MultipartFile file) {
        log.debug("POST /api/admin/schedule-upload/preview – file={}, size={}",
                file.getOriginalFilename(), file.getSize());
        return ResponseEntity.ok(scheduleImportService.preview(file));
    }

    /**
     * Apply the approved rows from a confirmed schedule import.
     *
     * @param request the rows to import
     * @return import summary
     */
    @PostMapping("/import")
    @IsAdministrator
    public ResponseEntity<ScheduleImportResponse> importOfferings(
            @RequestBody ScheduleImportRequest request) {
        log.debug("POST /api/admin/schedule-upload/import – rows={}",
                request.getRows() != null ? request.getRows().size() : 0);
        return ResponseEntity.ok(scheduleImportService.importOfferings(request));
    }
}
