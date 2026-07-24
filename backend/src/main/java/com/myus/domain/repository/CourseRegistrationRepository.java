package com.myus.domain.repository;

import com.myus.domain.model.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link CourseRegistration} entity.
 *
 * <p>Supports enrollment operations: checking duplicates,
 * counting enrolled students, and retrieving student registrations
 * with eager-loaded offering and course data.</p>
 */
@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {

    /**
     * Find all registrations for a student, eagerly loading offering and course.
     */
    @Query("SELECT r FROM CourseRegistration r " +
           "JOIN FETCH r.offering o " +
           "JOIN FETCH o.course " +
           "WHERE r.student.studentId = :studentId " +
           "ORDER BY r.registeredAt DESC")
    List<CourseRegistration> findByStudentIdWithOfferingAndCourse(@Param("studentId") Long studentId);

    /**
     * Check if a student already has an active (non-dropped) registration
     * for a specific offering.
     */
    @Query("SELECT r FROM CourseRegistration r " +
           "WHERE r.student.studentId = :studentId " +
           "AND r.offering.offeringId = :offeringId " +
           "AND r.status <> 'Dropped'")
    Optional<CourseRegistration> findActiveByStudentAndOffering(
            @Param("studentId") Long studentId,
            @Param("offeringId") Long offeringId);

    /**
     * Count the number of active (non-dropped) registrations for an offering.
     * Used to determine available seats.
     */
    @Query("SELECT COUNT(r) FROM CourseRegistration r " +
           "WHERE r.offering.offeringId = :offeringId " +
           "AND r.status <> 'Dropped'")
    long countActiveByOfferingId(@Param("offeringId") Long offeringId);
}
