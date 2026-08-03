package com.myus.repository;

import com.myus.entity.ExamSchedule;
import com.myus.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {

    @Query("SELECT e FROM ExamSchedule e " +
           "JOIN FETCH e.courseOffering o " +
           "JOIN FETCH o.course " +
           "WHERE e.student = :student AND e.term = :term AND e.type = :type")
    List<ExamSchedule> findByStudentAndTermAndType(
            @Param("student") Student student,
            @Param("term") String term,
            @Param("type") String type);

    @Query("SELECT e FROM ExamSchedule e " +
           "JOIN FETCH e.courseOffering o " +
           "JOIN FETCH o.course " +
           "WHERE e.student = :student AND CAST(e.examDate AS LocalDate) = :date")
    List<ExamSchedule> findByStudentAndExamDate(
            @Param("student") Student student,
            @Param("date") LocalDate date);
}
