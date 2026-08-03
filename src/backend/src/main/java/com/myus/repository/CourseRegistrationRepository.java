package com.myus.repository;

import com.myus.entity.CourseRegistration;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {

    List<CourseRegistration> findByStudentStudentId(Long studentId);

    /**
     * Count active (non-dropped) registrations for a given course offering.
     * Active statuses: Requested, Enrolled, Waitlisted.
     */
    @Query("SELECT COUNT(r) FROM CourseRegistration r " +
           "WHERE r.offering.offeringId = :offeringId " +
           "AND r.status IN ('Requested', 'Enrolled', 'Waitlisted')")
    long countActiveByOfferingId(@Param("offeringId") Long offeringId);

    /**
     * Find an active registration for a specific student and offering.
     */
    @Query("SELECT r FROM CourseRegistration r " +
           "WHERE r.student.studentId = :studentId " +
           "AND r.offering.offeringId = :offeringId " +
           "AND r.status IN ('Requested', 'Enrolled', 'Waitlisted')")
    Optional<CourseRegistration> findActiveByStudentAndOffering(
            @Param("studentId") Long studentId,
            @Param("offeringId") Long offeringId);

    /**
     * Find all registrations for a student, eagerly fetching the offering and course.
     */
    @Query("SELECT r FROM CourseRegistration r " +
           "JOIN FETCH r.offering o " +
           "JOIN FETCH o.course c " +
           "WHERE r.student.studentId = :studentId")
    List<CourseRegistration> findByStudentIdWithOfferingAndCourse(@Param("studentId") Long studentId);
}
