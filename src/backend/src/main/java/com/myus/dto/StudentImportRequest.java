package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload to apply approved bulk student-import rows.
 *
 * <p>The frontend sends back the rows that passed validation (from the preview)
 * for the administrator to confirm and import.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentImportRequest {

    private List<StudentImportRow> rows = new ArrayList<>();

    /** When {@code true}, existing students (matching username/email) are updated. */
    private boolean updateExisting = false;
}
