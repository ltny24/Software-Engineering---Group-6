package com.myus.service;

import com.myus.entity.AcademicRecord;
import com.myus.repository.AcademicRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class AcademicServiceImpl implements AcademicService {

    private final AcademicRecordRepository academicRecordRepository;

    public AcademicServiceImpl(AcademicRecordRepository academicRecordRepository) {
        this.academicRecordRepository = academicRecordRepository;
    }

    @Override
    public List<AcademicRecord> getAcademicRecordsForStudent(Long studentId) {
        return academicRecordRepository.findByStudentStudentId(studentId);
    }

    @Override
    public Optional<AcademicRecord> getLatestAcademicRecordForStudent(Long studentId) {
        return academicRecordRepository.findByStudentStudentId(studentId)
                .stream()
                .max(Comparator.comparing(AcademicRecord::getTerm));
    }
}
