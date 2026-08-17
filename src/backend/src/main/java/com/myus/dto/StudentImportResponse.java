package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Summary of a confirmed bulk student import, reporting how many students were
 * added and how many rows were skipped (with reasons).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentImportResponse {

    private int added;
    private int updated;
    private int skipped;

    private List<String> messages = new ArrayList<>();
}
