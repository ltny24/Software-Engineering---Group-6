package com.myus.service.ai;

import com.myus.dto.ai.CourseSuggestionDTO;
import com.myus.entity.Course;
import com.myus.entity.Student;
import com.myus.repository.CourseOfferingRepository;
import com.myus.repository.CourseRepository;
import com.myus.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Smart course recommendation engine that evaluates prerequisite rules
 * and ranks eligible courses for next-semester enrollment.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CourseRecommendationService {

    private final CourseRepository courseRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final GradeRepository gradeRepository;

    /**
     * Generate course recommendations for the given student.
     * Ranked by: mandatory major core → previously failed → general requirements.
     */
    public List<CourseSuggestionDTO> recommendCourses(Student student) {
        // Get completed course codes
        Set<String> completedCodes = gradeRepository.findByStudentStudentId(student.getStudentId())
                .stream()
                .filter(g -> g.getCourse() != null)
                .map(g -> g.getCourse().getCourseCode())
                .collect(Collectors.toSet());

        // Get failed course codes (grade point < 1.0 or grade F)
        Set<String> failedCodes = gradeRepository.findByStudentStudentId(student.getStudentId())
                .stream()
                .filter(g -> g.getGradeValue() != null
                        && (g.getGradeValue().equalsIgnoreCase("F")
                        || (g.getGradePoint() != null && g.getGradePoint().compareTo(java.math.BigDecimal.ONE) < 0)))
                .filter(g -> g.getCourse() != null)
                .map(g -> g.getCourse().getCourseCode())
                .collect(Collectors.toSet());

        List<Course> allCourses = courseRepository.findAll();
        List<CourseSuggestionDTO> suggestions = new ArrayList<>();

        for (Course course : allCourses) {
            // Skip already completed courses
            if (completedCodes.contains(course.getCourseCode())) {
                continue;
            }

            boolean prerequisiteMet = checkPrerequisite(course, completedCodes);
            String reason = buildReason(course, failedCodes.contains(course.getCourseCode()), prerequisiteMet);

            CourseSuggestionDTO dto = CourseSuggestionDTO.builder()
                    .courseOfferingId(course.getCourseId())
                    .courseCode(course.getCourseCode())
                    .courseName(course.getCourseName())
                    .credits(course.getCredits() != null ? course.getCredits() : 3)
                    .prerequisiteCleared(prerequisiteMet)
                    .reasonForRecommendation(reason)
                    .prerequisiteStatus(prerequisiteMet ? "CLEARED" : "MISSING")
                    .build();

            suggestions.add(dto);
        }

        // Sort: mandatory core (prereq met) → previously failed → general → unavailable
        suggestions.sort(Comparator
                .comparingInt((CourseSuggestionDTO s) -> s.isPrerequisiteCleared() ? 0 : 1)
                .thenComparingInt(s -> failedCodes.contains(s.getCourseCode()) ? 0 : 1)
                .thenComparing(CourseSuggestionDTO::getCourseCode));

        log.info("Generated {} course suggestions for student {}", suggestions.size(), student.getUsername());
        return suggestions.stream().limit(10).collect(Collectors.toList());
    }

    /**
     * Check if the student has met the prerequisites for a course.
     */
    private boolean checkPrerequisite(Course course, Set<String> completedCodes) {
        String prereqs = course.getPrerequisites();
        if (prereqs == null || prereqs.isBlank() || prereqs.equalsIgnoreCase("None")) {
            return true;
        }
        // Split on commas or "and"
        String[] required = prereqs.split("[,;]|\\band\\b");
        for (String req : required) {
            String trimmed = req.trim();
            if (trimmed.isEmpty()) continue;
            if (!completedCodes.contains(trimmed)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Build a human-readable recommendation reason.
     */
    private String buildReason(Course course, boolean isRetake, boolean prereqMet) {
        if (isRetake) {
            return "Previously attempted — retaking this course will improve your GPA and unlock further subjects.";
        }
        if (!prereqMet) {
            return "Prerequisite(s) not yet completed: " + course.getPrerequisites();
        }
        String dept = course.getDepartment() != null ? course.getDepartment() : "General";
        return "Core requirement for " + dept + " — recommended to maintain steady academic progress.";
    }
}
