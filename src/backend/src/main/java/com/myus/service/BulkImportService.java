package com.myus.service;

import com.myus.dto.CourseImportPreviewResponse;
import com.myus.dto.CourseImportRequest;
import com.myus.dto.CourseImportResponse;
import com.myus.dto.StudentImportPreviewResponse;
import com.myus.dto.StudentImportRequest;
import com.myus.dto.StudentImportResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service contract for administrator bulk data import (FR-008 / UC-11a).
 *
 * <p>Allows an administrator to upload a CSV or XLSX file describing student or
 * course records, validate its structure and contents, review a preview, and
 * then apply the approved rows.</p>
 */
public interface BulkImportService {

    /**
     * Parse and validate an uploaded student file without writing to the database.
     */
    StudentImportPreviewResponse previewStudents(MultipartFile file);

    /**
     * Persist the approved student rows from a confirmed import.
     *
     * @param request       the rows to import
     * @param adminUsername the administrator performing the import (audit log)
     */
    StudentImportResponse importStudents(StudentImportRequest request, String adminUsername);

    /**
     * Parse and validate an uploaded course file without writing to the database.
     */
    CourseImportPreviewResponse previewCourses(MultipartFile file);

    /**
     * Persist the approved course rows from a confirmed import (upsert by courseCode).
     *
     * @param request       the rows to import
     * @param adminUsername the administrator performing the import (audit log)
     */
    CourseImportResponse importCourses(CourseImportRequest request, String adminUsername);
}
