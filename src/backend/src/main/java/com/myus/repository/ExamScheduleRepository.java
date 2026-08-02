package com.myus.repository;
import com.myus.entity.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    java.util.List<ExamSchedule> findByStudentAndTermAndType(com.myus.entity.Student student, String term, String type);
    java.util.List<ExamSchedule> findByStudentAndExamDate(com.myus.entity.Student student, java.time.LocalDate date);
}
