package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Summary of a confirmed master-schedule import, reporting how many offerings
 * were added and how many rows were skipped (with reasons).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleImportResponse {

    private int added;
    private int skipped;

    private List<String> messages = new ArrayList<>();
}
