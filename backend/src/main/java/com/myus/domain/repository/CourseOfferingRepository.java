package com.myus.domain.repository;

import com.myus.domain.model.CourseOffering;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link CourseOffering} entity.
 *
 * <p>Supports paginated browsing with search, department, and term filters.
 * Uses JOIN FETCH to eagerly load associated Course data and avoid N+1 queries.</p>
 */
@Repository
public interface CourseOfferingRepository extends JpaRepository<CourseOffering, Long> {

    /**
     * Browse all offerings with their course data (eager fetch).
     */
    @Query("SELECT o FROM CourseOffering o JOIN FETCH o.course")
    Page<CourseOffering> findAllWithCourse(Pageable pageable);

    /**
     * Filter offerings by term.
     */
    @Query("SELECT o FROM CourseOffering o JOIN FETCH o.course WHERE o.term = :term")
    Page<CourseOffering> findByTermWithCourse(@Param("term") String term, Pageable pageable);

    /**
     * Filter offerings by department.
     */
    @Query("SELECT o FROM CourseOffering o JOIN FETCH o.course c WHERE c.department = :department")
    Page<CourseOffering> findByDepartmentWithCourse(@Param("department") String department, Pageable pageable);

    /**
     * Search offerings by course code or course name (case-insensitive partial match).
     */
    @Query("SELECT o FROM CourseOffering o JOIN FETCH o.course c " +
           "WHERE LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<CourseOffering> searchWithCourse(@Param("search") String search, Pageable pageable);

    /**
     * Combined search + term filter.
     */
    @Query("SELECT o FROM CourseOffering o JOIN FETCH o.course c " +
           "WHERE o.term = :term " +
           "AND (LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<CourseOffering> searchByTermWithCourse(@Param("search") String search,
                                                @Param("term") String term,
                                                Pageable pageable);

    /**
     * Combined search + department filter.
     */
    @Query("SELECT o FROM CourseOffering o JOIN FETCH o.course c " +
           "WHERE c.department = :department " +
           "AND (LOWER(c.courseCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(c.courseName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<CourseOffering> searchByDepartmentWithCourse(@Param("search") String search,
                                                      @Param("department") String department,
                                                      Pageable pageable);
}
