package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeOptionResponse {
    private Long gradeId;
    private String courseCode;
    private String courseName;
    private String currentGrade;
    private String term;
    private Boolean isFinalized;
    private Boolean isEligibleForAppeal;
}
