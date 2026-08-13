package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of a class-transfer operation, reporting how many students were
 * successfully moved and which students failed (with reasons).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassTransferResponse {

    private int transferredCount;

    private List<TransferFailure> failed = new ArrayList<>();
}
