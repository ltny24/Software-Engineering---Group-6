package com.myus.service;

import com.myus.entity.AcademicRecord;

import java.util.List;
import java.util.Optional;

public interface AcademicService {
    List<AcademicRecord> getAcademicRecordsForStudent(Long studentId);

    Optional<AcademicRecord> getLatestAcademicRecordForStudent(Long studentId);
}
