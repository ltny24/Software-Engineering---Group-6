package com.myus.service;

import com.myus.dto.StudentProfileResponse;
import com.myus.dto.StudentProfileUpdateRequest;

/**
 * Service contract for student profile operations.
 */
public interface ProfileService {

    /**
     * Update an authenticated student's profile.
     *
     * @param username the authenticated student's username
     * @param updateRequest payload containing allowed profile updates
     * @return updated profile response DTO
     */
    StudentProfileResponse updateProfile(String username, StudentProfileUpdateRequest updateRequest);
}
