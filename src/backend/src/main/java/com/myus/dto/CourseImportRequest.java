package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload to apply approved bulk course-import rows.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseImportRequest {

    private List<CourseImportRow> rows = new ArrayList<>();
}
