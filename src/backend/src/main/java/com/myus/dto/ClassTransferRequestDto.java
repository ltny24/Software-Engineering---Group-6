package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload to perform one or more student class transfers (UC-14).
 *
 * <p>Students are moved from {@code fromOfferingId} to {@code toOfferingId}.
 * The override flags let an authorized administrator bypass capacity or
 * schedule-conflict checks (recorded in the audit log).</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassTransferRequestDto {

    private List<Long> studentIds = new ArrayList<>();

    private Long fromOfferingId;

    private Long toOfferingId;

    private String justification;

    private boolean overrideCapacity;

    private boolean overrideConflict;
}
