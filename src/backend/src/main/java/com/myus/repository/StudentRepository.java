package com.myus.repository;

import com.myus.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUsername(String username);

    Optional<Student> findByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
           "(:keyword IS NULL OR " +
           "LOWER(s.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:major IS NULL OR s.major = :major) " +
           "AND (:enrollmentStatus IS NULL OR s.enrollmentStatus = :enrollmentStatus)")
    Page<Student> searchStudents(
            @Param("keyword") String keyword,
            @Param("major") String major,
            @Param("enrollmentStatus") String enrollmentStatus,
            Pageable pageable
    );
}