package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of validating an uploaded master-schedule CSV before import.
 *
 * <p>Contains the rows that passed validation ({@code validRows}) and the rows
 * that failed ({@code invalidRows}) with per-row error messages, so the
 * administrator can review before confirming the import (UC-11a / UC-11b).</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchedulePreviewResponse {

    private int totalRows;
    private int validCount;
    private int invalidCount;

    private List<ScheduleRow> validRows = new ArrayList<>();
    private List<ScheduleRowIssue> invalidRows = new ArrayList<>();
}
