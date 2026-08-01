package myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing the student's graduation progress and degree audit summary.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraduationProgressDTO {

    private int totalRequiredCredits;
    private int completedCredits;
    private int remainingCredits;
    private double estimatedSemestersLeft;
    private double completionPercentage;
    private List<String> criticalMilestonesPending;
    private String estimatedGraduationDate;
}
