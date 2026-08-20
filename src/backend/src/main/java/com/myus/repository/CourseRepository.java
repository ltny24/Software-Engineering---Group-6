package com.myus.repository;

import com.myus.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link Course} entity.
 *
 * <p>Provides course catalog browsing with search and filter support.</p>
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Search courses by code or name (case-insensitive partial match).
     */
    Page<Course> findByCourseCodeContainingIgnoreCaseOrCourseNameContainingIgnoreCase(
            String courseCode, String courseName, Pageable pageable);

    /**
     * Filter courses by department.
     */
    Page<Course> findByDepartmentIgnoreCase(String department, Pageable pageable);

    /**
     * Find a course by its exact code (used by master-schedule import to resolve
     * a CSV {@code courseCode} to its database row).
     */
    Optional<Course> findByCourseCode(String courseCode);
}
