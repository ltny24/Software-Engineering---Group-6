package com.myus.fg04.timetable;

import com.myus.service.TimetableService;
import com.myus.service.TimetableServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@DisplayName("FG04 – Timetable: Service Layer Tests")
class TimetableServiceTest {

    @InjectMocks
    private TimetableServiceImpl timetableService;

    @Test
    @DisplayName("Test getting timetable (stub returns empty list)")
    void testGetStudentTimetable() {
        assertThat(timetableService.getStudentTimetable(1L, "2024-1")).isEmpty();
    }

    @Test
    @DisplayName("Test implementing TimetableService interface")
    void testImplementsInterface() {
        assertThat(timetableService).isInstanceOf(TimetableService.class);
    }
}
