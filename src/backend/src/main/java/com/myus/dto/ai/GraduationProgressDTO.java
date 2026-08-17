package com.myus.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO containing the student's graduation progress summary.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraduationProgressDTO {

    private int totalRequiredCredits;
    private int completedCredits;
    private int remainingCredits;
    private double estimatedSemestersLeft;
    private double completionPercentage;
    private List<String> criticalMilestonesPending;
    private List<String> completedMilestones;
}
