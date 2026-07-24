package com.myus.application.dto;

import java.math.BigDecimal;

/**
 * Response DTO for a student's grade record.
 *
 * <p>Matches the frontend {@code GradeDTO} interface.</p>
 */
public class GradeResponse {

    private Long gradeId;
    private String term;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private String gradeValue;
    private BigDecimal gradePoint;
    private BigDecimal overallScore;

    public GradeResponse() {
    }

    public GradeResponse(Long gradeId, String term, String courseCode, String courseName,
                         Integer credits, String gradeValue, BigDecimal gradePoint,
                         BigDecimal overallScore) {
        this.gradeId = gradeId;
        this.term = term;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.gradeValue = gradeValue;
        this.gradePoint = gradePoint;
        this.overallScore = overallScore;
    }

    public Long getGradeId() { return gradeId; }
    public void setGradeId(Long gradeId) { this.gradeId = gradeId; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getGradeValue() { return gradeValue; }
    public void setGradeValue(String gradeValue) { this.gradeValue = gradeValue; }

    public BigDecimal getGradePoint() { return gradePoint; }
    public void setGradePoint(BigDecimal gradePoint) { this.gradePoint = gradePoint; }

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
}
