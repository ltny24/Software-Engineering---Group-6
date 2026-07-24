package com.myus.domain.repository;

import com.myus.domain.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for {@link Grade} entity operations.
 *
 * <p>Used by the appeal workflow to validate that a grade exists
 * and belongs to the submitting student before an appeal can be created.</p>
 */
@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    /**
     * Find all grades belonging to a specific student.
     *
     * @param studentId the student's ID
     * @return list of grades for the student
     */
    List<Grade> findByStudentStudentId(Long studentId);
}
