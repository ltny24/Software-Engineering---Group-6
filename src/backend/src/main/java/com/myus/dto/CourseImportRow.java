package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single parsed row from a bulk course-import upload (one Course).
 *
 * <p>Represents the expected CSV/XLSX columns for a course record:
 * {@code courseCode, courseName, description, credits, prerequisites,
 * department, semester, capacity}. Required columns are
 * {@code courseCode, courseName}.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseImportRow {

    private String courseCode;
    private String courseName;
    private String description;
    private String credits;
    private String prerequisites;
    private String department;
    private String semester;
    private String capacity;
}
