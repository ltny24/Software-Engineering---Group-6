package com.myus.domain.repository;

import com.myus.domain.model.TuitionAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link TuitionAccount} entity operations.
 */
@Repository
public interface TuitionAccountRepository extends JpaRepository<TuitionAccount, Long> {

    /**
     * Find the tuition account for a specific student and term.
     *
     * @param studentId the student's ID
     * @param term      the academic term
     * @return optional tuition account
     */
    Optional<TuitionAccount> findByStudentStudentIdAndTerm(Long studentId, String term);
}
