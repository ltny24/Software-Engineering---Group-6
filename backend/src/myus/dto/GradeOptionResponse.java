package myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeOptionResponse {
    private Long gradeId;
    private String courseCode;
    private String courseName;
    private String currentGrade;
    private BigDecimal midtermGrade;
    private BigDecimal finalGrade;
    private BigDecimal gradePoint;
    private String term;
    private Boolean isFinalized;
    private Boolean isEligibleForAppeal;
}
