package com.myus.service;

import com.myus.entity.AcademicRecord;
import com.myus.repository.AcademicRecordRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AcademicServiceImplTest {

    @Mock
    private AcademicRecordRepository academicRecordRepository;

    @InjectMocks
    private AcademicServiceImpl academicService;

    @Test
    void getAcademicRecordsForStudentReturnsRepositoryResults() {
        AcademicRecord record = new AcademicRecord();
        record.setRecordId(100L);
        record.setTerm("2024-2025");
        record.setCumulativeGPA(new BigDecimal("3.75"));
        record.setEarnedCredits(90);

        when(academicRecordRepository.findByStudentStudentId(7L)).thenReturn(List.of(record));

        List<AcademicRecord> records = academicService.getAcademicRecordsForStudent(7L);

        assertThat(records).hasSize(1);
        assertThat(records.get(0).getTerm()).isEqualTo("2024-2025");
    }

    @Test
    void getLatestAcademicRecordForStudentReturnsHighestTerm() {
        AcademicRecord older = new AcademicRecord();
        older.setRecordId(1L);
        older.setTerm("2022-2023");

        AcademicRecord newer = new AcademicRecord();
        newer.setRecordId(2L);
        newer.setTerm("2024-2025");

        when(academicRecordRepository.findByStudentStudentId(7L)).thenReturn(List.of(older, newer));

        Optional<AcademicRecord> result = academicService.getLatestAcademicRecordForStudent(7L);

        assertThat(result).isPresent();
        assertThat(result.get().getRecordId()).isEqualTo(2L);
    }
}
