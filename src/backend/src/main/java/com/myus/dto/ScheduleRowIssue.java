package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * A master-schedule upload row that failed validation, together with the
 * list of human-readable errors describing why it was rejected (UC-11b).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRowIssue {

    /** 1-based row number in the uploaded file (header excluded). */
    private int rowNumber;

    private String courseCode;
    private String section;
    private String term;
    private String schedule;
    private String instructor;
    private String location;
    private String room;

    private List<String> errors = new ArrayList<>();
}
