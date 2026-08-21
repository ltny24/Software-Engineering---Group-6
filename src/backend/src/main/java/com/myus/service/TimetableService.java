package com.myus.service;

import com.myus.dto.ExamScheduleResponse;
import com.myus.dto.TimetableItemResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Service contract for timetable and exam schedule operations.
 *
 * <p>Provides access to student timetables, exam schedules, and conflict detection.</p>
 */
public interface TimetableService {

    /**
     * Retrieve the timetable for a specific student.
     *
     * @param studentId the student's ID
     * @param semester  the academic semester (e.g., "2024-1")
     * @return list of timetable items
     */
    List<TimetableItemResponse> getStudentTimetable(Long studentId, String semester);

    /**
     * Retrieve the exam schedule for a specific student.
     *
     * @param studentId the student's ID
     * @param semester  the academic semester
     * @return list of exam schedule entries
     */
    List<ExamScheduleResponse> getStudentExamSchedule(Long studentId, String semester);

    /**
     * Get the display name for a time slot.
     *
     * @param slot the slot number
     * @return the slot description
     */
    String getTimeSlot(int slot);

    /**
     * Retrieve the timetable for the currently authenticated student.
     *
     * @param username the student's username
     * @return list of timetable items
     */
    List<TimetableItemResponse> getMyTimetable(String username);

    /**
     * Check if the student has any schedule conflicts.
     *
     * @param username the student's username
     * @return true if a conflict exists
     */
    boolean hasScheduleConflict(String username);

    /**
     * Retrieve the exam schedule for the authenticated student.
     *
     * @param username the student's username
     * @param term     the academic term
     * @param type     the exam type filter
     * @return list of exam schedule entries
     */
    List<ExamScheduleResponse> getExamSchedule(String username, String term, String type);

    /**
     * Check if the student has any exam conflicts.
     *
     * @param username the student's username
     * @param term     the academic term
     * @param type     the exam type filter
     * @return true if a conflict exists
     */
    boolean hasExamConflict(String username, String term, String type);

    /**
     * Retrieve exam schedules for a specific date.
     *
     * @param username the student's username
     * @param date     the date to query
     * @return list of exam schedule entries for that date
     */
    List<ExamScheduleResponse> getExamsByDate(String username, LocalDate date);
}
