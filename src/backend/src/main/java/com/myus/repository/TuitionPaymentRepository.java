package com.myus.repository;

import com.myus.entity.TuitionPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuitionPaymentRepository extends JpaRepository<TuitionPayment, Long> {
    List<TuitionPayment> findByTuitionAccountStudentStudentId(Long studentId);
}
