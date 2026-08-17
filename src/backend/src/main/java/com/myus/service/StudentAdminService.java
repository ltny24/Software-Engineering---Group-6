package com.myus.service;

import com.myus.dto.StudentProfileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentAdminService {

    Page<StudentProfileResponse> searchStudents(String keyword, String major, String enrollmentStatus, Pageable pageable);

    StudentProfileResponse getStudentDetails(Long studentId, String adminUsername);
}
