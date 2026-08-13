package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single parsed row from a master-schedule upload (one course offering/section).
 *
 * <p>Represents the expected CSV columns for a course offering:
 * {@code courseCode, section, term, schedule, instructor, location, room}.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRow {

    private String courseCode;
    private String section;
    private String term;
    private String schedule;
    private String instructor;
    private String location;
    private String room;
}
