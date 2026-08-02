package com.myus.service.ai;

import com.myus.dto.ai.GraduationProgressDTO;
import com.myus.entity.Student;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Calculates graduation timeline projections based on a student's
 * credit completion history and remaining requirements.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GraduationTrackingService {

    private final ProfileAnalysisService profileAnalysisService;

    /**
     * Estimate the minimum remaining semesters required for graduation.
     *
     * @param student         the authenticated student
     * @param creditsPerTerm  target credits per semester (default 15)
     * @return graduation progress with estimated timeline
     */
    public GraduationProgressDTO projectGraduation(Student student, int creditsPerTerm) {
        GraduationProgressDTO progress = profileAnalysisService.getGraduationProgress(student);

        int effectiveCredits = creditsPerTerm > 0 ? creditsPerTerm : 15;
        double semestersLeft = Math.ceil((double) progress.getRemainingCredits() / effectiveCredits);

        // Update the estimate
        progress.setEstimatedSemestersLeft(semestersLeft);

        log.info("Graduation projection for {}: {} credits remaining, ~{:.1f} semesters at {} cr/term",
                student.getUsername(), progress.getRemainingCredits(), semestersLeft, effectiveCredits);

        return progress;
    }
}
