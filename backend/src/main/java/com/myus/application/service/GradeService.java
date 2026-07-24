package com.myus.application.service;

import com.myus.application.dto.GradeResponse;

import java.util.List;

/**
 * Service contract for student grade operations.
 */
public interface GradeService {

    /**
     * Retrieve all grades for the authenticated student.
     *
     * @param username the authenticated student's username
     * @return list of grade response DTOs
     */
    List<GradeResponse> getMyGrades(String username);
}
