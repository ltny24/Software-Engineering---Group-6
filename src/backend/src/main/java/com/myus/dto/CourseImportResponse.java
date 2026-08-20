package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Summary of a confirmed bulk course import: added, updated, and skipped
 * records (UC-11a 3.1.8).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseImportResponse {

    private int added;
    private int updated;
    private int skipped;

    private List<String> messages = new ArrayList<>();
}
