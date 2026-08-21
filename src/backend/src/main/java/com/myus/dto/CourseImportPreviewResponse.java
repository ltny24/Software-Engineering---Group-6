package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of validating an uploaded course CSV/XLSX before import.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseImportPreviewResponse {

    private int totalRows;
    private int validCount;
    private int invalidCount;

    private List<CourseImportRow> validRows = new ArrayList<>();
    private List<CourseImportIssue> invalidRows = new ArrayList<>();
}
