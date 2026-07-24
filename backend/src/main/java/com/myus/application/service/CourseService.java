package com.myus.application.service;

import com.myus.application.dto.CourseOfferingResponse;

import org.springframework.data.domain.Page;

/**
 * Service contract for course catalog browsing operations.
 *
 * <p>Provides read-only access to course offerings with support
 * for search, filtering, and pagination.</p>
 */
public interface CourseService {

    /**
     * Browse course offerings with optional search and filters.
     *
     * @param page       zero-based page index
     * @param size       number of items per page
     * @param search     optional keyword to search by course code or name
     * @param department optional department filter
     * @param term       optional term/semester filter
     * @return paginated list of course offering DTOs
     */
    Page<CourseOfferingResponse> browseCourses(int page, int size,
                                               String search, String department, String term);

    /**
     * Retrieve a single course offering by its ID.
     *
     * @param offeringId the offering ID
     * @return the course offering DTO
     * @throws com.myus.exception.ResourceNotFoundException if not found
     */
    CourseOfferingResponse getOfferingById(Long offeringId);
}
