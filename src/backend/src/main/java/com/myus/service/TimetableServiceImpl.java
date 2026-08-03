package com.myus.service;

import com.myus.dto.ExamScheduleResponse;
import com.myus.dto.TimetableItemResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

/**
 * Implementation of {@link TimetableService} for timetable and exam schedule retrieval.
 *
 * <p><b>Note:</b> This is currently a stub implementation. Full implementation
 * requires integration with the timetable and exam schedule data sources.</p>
 */
@Slf4j
@Service
public class TimetableServiceImpl implements TimetableService {

    @Override
    public List<TimetableItemResponse> getStudentTimetable(Long studentId, String semester) {
        log.warn("getStudentTimetable is not yet implemented (studentId={}, semester={})", studentId, semester);
        return Collections.emptyList();
    }

    @Override
    public List<ExamScheduleResponse> getStudentExamSchedule(Long studentId, String semester) {
        log.warn("getStudentExamSchedule is not yet implemented (studentId={}, semester={})", studentId, semester);
        return Collections.emptyList();
    }

    @Override
    public String getTimeSlot(int slot) {
        return "Slot " + slot;
    }

    @Override
    public List<TimetableItemResponse> getMyTimetable(String username) {
        log.warn("getMyTimetable is not yet implemented (username={})", username);
        return Collections.emptyList();
    }

    @Override
    public boolean hasScheduleConflict(String username) {
        log.warn("hasScheduleConflict is not yet implemented (username={})", username);
        return false;
    }

    @Override
    public List<ExamScheduleResponse> getExamSchedule(String username, String term, String type) {
        log.warn("getExamSchedule is not yet implemented (username={}, term={}, type={})", username, term, type);
        return Collections.emptyList();
    }

    @Override
    public boolean hasExamConflict(String username, String term, String type) {
        log.warn("hasExamConflict is not yet implemented (username={}, term={}, type={})", username, term, type);
        return false;
    }

    @Override
    public List<ExamScheduleResponse> getExamsByDate(String username, LocalDate date) {
        log.warn("getExamsByDate is not yet implemented (username={}, date={})", username, date);
        return Collections.emptyList();
    }
}
