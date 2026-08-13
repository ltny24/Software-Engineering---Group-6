package com.myus.service;

import com.myus.dto.StudentProfileResponse;
import com.myus.entity.AuditLog;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.AuditLogRepository;
import com.myus.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentAdminServiceImpl implements StudentAdminService {

    private final StudentRepository studentRepository;
    private final AuditLogRepository auditLogRepository;

    public StudentAdminServiceImpl(StudentRepository studentRepository, AuditLogRepository auditLogRepository) {
        this.studentRepository = studentRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentProfileResponse> searchStudents(String keyword, String major, String enrollmentStatus, Pageable pageable) {
        if (keyword != null && keyword.trim().isEmpty()) {
            keyword = null;
        }
        if (major != null && major.trim().isEmpty()) {
            major = null;
        }
        if (enrollmentStatus != null && enrollmentStatus.trim().isEmpty()) {
            enrollmentStatus = null;
        }
        
        Page<Student> students = studentRepository.searchStudents(keyword, major, enrollmentStatus, pageable);
        return students.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public StudentProfileResponse getStudentDetails(Long studentId, String adminUsername) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Create audit log for access
        AuditLog log = new AuditLog();
        log.setAdminUsername(adminUsername);
        log.setActionType("VIEW_RECORD");
        log.setTargetEntity("Student");
        log.setTargetEntityId(studentId.toString());
        log.setDetails("Admin viewed student profile for username: " + student.getUsername());
        auditLogRepository.save(log);

        return mapToResponse(student);
    }

    private StudentProfileResponse mapToResponse(Student student) {
        return new StudentProfileResponse(
                student.getStudentId(),
                student.getUsername(),
                student.getEmail(),
                student.getFirstName(),
                student.getMiddleName(),
                student.getLastName(),
                student.getPhone(),
                student.getAddress(),
                student.getDateOfBirth(),
                student.getStudentType(),
                student.getMajor(),
                student.getEnrollmentStatus(),
                student.getRegistrationStatus()
        );
    }
}
