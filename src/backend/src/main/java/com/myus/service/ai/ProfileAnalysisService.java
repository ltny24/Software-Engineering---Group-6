package com.myus.service.ai;

import com.myus.dto.ai.GraduationProgressDTO;
import com.myus.entity.Grade;
import com.myus.entity.Student;
import com.myus.repository.CourseRegistrationRepository;
import com.myus.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Analyses a student's academic profile: completed courses, earned credits,
 * and curriculum progress.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileAnalysisService {

    private final GradeRepository gradeRepository;
    private final CourseRegistrationRepository registrationRepository;

    private static final int TOTAL_REQUIRED_CREDITS = 135;

    /**
     * Retrieve all completed courses for the given student.
     */
    public List<Grade> getCompletedCourses(Student student) {
        return gradeRepository.findByStudentStudentId(student.getStudentId());
    }

    /**
     * Count total earned credits from completed grades.
     * A course is considered completed if grade point >= 1.0 (passing grade D or above).
     */
    public int getEarnedCredits(Student student) {
        List<Grade> grades = gradeRepository.findByStudentStudentId(student.getStudentId());
        return grades.stream()
                .filter(g -> g.getGradePoint() != null && g.getGradePoint().compareTo(java.math.BigDecimal.ONE) >= 0)
                .mapToInt(g -> g.getCourse() != null && g.getCourse().getCredits() != null
                        ? g.getCourse().getCredits()
                        : 3) // default credit value
                .sum();
    }

    /**
     * Build a graduation progress summary for the student.
     */
    public GraduationProgressDTO getGraduationProgress(Student student) {
        int earned = getEarnedCredits(student);
        int remaining = Math.max(0, TOTAL_REQUIRED_CREDITS - earned);
        double completionPct = TOTAL_REQUIRED_CREDITS > 0
                ? Math.round(((double) earned / TOTAL_REQUIRED_CREDITS) * 1000.0) / 10.0
                : 0.0;

        // Estimate semesters left based on 15 credits/semester average
        double estimatedSemesters = Math.ceil(remaining / 15.0);

        // Identify completed courses
        List<String> completed = getCompletedCourses(student).stream()
                .filter(g -> g.getCourse() != null)
                .map(g -> g.getCourse().getCourseCode())
                .collect(Collectors.toList());

        // Critical milestones
        List<String> pending = new java.util.ArrayList<>();
        if (remaining > 0) {
            pending.add("Complete remaining " + remaining + " credits");
        }
        if (earned < 30) {
            pending.add("Complete General Education requirements (30+ credits)");
        }
        if (earned < 90) {
            pending.add("Enroll in capstone/internship before final year");
        }
        pending.add("Verify TOEIC / English proficiency requirement");

        return GraduationProgressDTO.builder()
                .totalRequiredCredits(TOTAL_REQUIRED_CREDITS)
                .completedCredits(earned)
                .remainingCredits(remaining)
                .estimatedSemestersLeft(estimatedSemesters)
                .completionPercentage(completionPct)
                .completedMilestones(completed)
                .criticalMilestonesPending(pending)
                .build();
    }
}
