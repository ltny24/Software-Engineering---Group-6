package com.myus.repository;

import com.myus.entity.Appeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link Appeal} entity operations.
 *
 * <p>Supports both student-facing queries (scoped by studentId)
 * and administrator-facing queries (all appeals, filtered by status).</p>
 */
@Repository
public interface AppealRepository extends JpaRepository<Appeal, Long> {

    /**
     * Find all appeals submitted by a specific student, ordered by submission date descending.
     *
     * @param studentId the student's ID
     * @return list of appeals for the student
     */
    List<Appeal> findByStudentStudentIdOrderBySubmittedAtDesc(Long studentId);

    /**
     * Find a specific appeal ensuring it belongs to the given student.
     * Used for secure student-scoped access.
     *
     * @param appealId  the appeal ID
     * @param studentId the student's ID
     * @return the appeal if it exists and belongs to the student
     */
    Optional<Appeal> findByAppealIdAndStudentStudentId(Long appealId, Long studentId);

    /**
     * Check whether an active (non-withdrawn) appeal already exists
     * for the given student and grade combination.
     * Prevents duplicate appeals on the same grade.
     *
     * @param studentId the student's ID
     * @param gradeId   the grade ID
     * @return true if an active appeal exists
     */
    boolean existsByStudentStudentIdAndGradeGradeIdAndStatusNot(Long studentId, Long gradeId, String status);

    /**
     * Find all appeals with a specific status, ordered by submission date descending.
     * Used by administrators to filter appeals.
     *
     * @param status the appeal status to filter by
     * @return list of appeals matching the status
     */
    List<Appeal> findByStatusOrderBySubmittedAtDesc(String status);

    /**
     * Find all appeals ordered by submission date descending.
     * Used by administrators to view all appeals.
     *
     * @return list of all appeals
     */
    List<Appeal> findAllByOrderBySubmittedAtDesc();
}
