package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single student whose class transfer could not be completed, with the reason.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferFailure {

    private Long studentId;
    private String studentName;
    private String reason;
}
