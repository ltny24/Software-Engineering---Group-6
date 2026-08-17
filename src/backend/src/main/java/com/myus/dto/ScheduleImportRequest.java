package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload to apply approved master-schedule rows.
 *
 * <p>The frontend sends back the rows that passed validation (from the preview)
 * for the administrator to confirm and import.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleImportRequest {

    private List<ScheduleRow> rows = new ArrayList<>();
}
