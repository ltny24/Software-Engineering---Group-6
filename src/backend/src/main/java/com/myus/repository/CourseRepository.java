package com.myus.repository;

import com.myus.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
