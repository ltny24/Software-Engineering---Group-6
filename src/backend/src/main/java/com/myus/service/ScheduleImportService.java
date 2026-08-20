package com.myus.service;

import com.myus.dto.ScheduleImportRequest;
import com.myus.dto.ScheduleImportResponse;
import com.myus.dto.SchedulePreviewResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service contract for master-schedule upload (FG7 / UC-11, UC-11a, UC-11b).
 *
 * <p>Allows an administrator to upload a CSV file describing course offerings,
 * validate its structure and contents, review a preview, and then apply the
 * approved rows.</p>
 */
public interface ScheduleImportService {

    /**
     * Parse and validate an uploaded CSV file without writing to the database.
     *
     * @param file the uploaded CSV file
     * @return a preview separating valid and invalid rows with per-row errors
     * @throws com.myus.exception.ScheduleImportException if the file is unreadable
     *         or missing required columns
     */
    SchedulePreviewResponse preview(MultipartFile file);

    /**
     * Persist the approved course-offering rows from a confirmed import.
     *
     * @param request the rows to import
     * @return a summary of added and skipped rows
     */
    ScheduleImportResponse importOfferings(ScheduleImportRequest request);
}
