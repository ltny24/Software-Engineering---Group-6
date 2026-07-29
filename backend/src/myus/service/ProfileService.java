package myus.service;

import myus.dto.StudentProfileResponse;
import myus.dto.StudentProfileUpdateRequest;

/**
 * Service contract for student profile operations.
 */
public interface ProfileService {

    /**
     * Retrieve an authenticated student's profile.
     *
     * @param username the authenticated student's username
     * @return profile response DTO
     */
    StudentProfileResponse getProfile(String username);

    /**
     * Update an authenticated student's profile.
     *
     * @param username the authenticated student's username
     * @param updateRequest payload containing allowed profile updates
     * @return updated profile response DTO
     */
    StudentProfileResponse updateProfile(String username, StudentProfileUpdateRequest updateRequest);
}
