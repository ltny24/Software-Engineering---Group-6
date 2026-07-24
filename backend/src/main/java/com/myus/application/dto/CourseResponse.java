package com.myus.application.dto;

/**
 * Response DTO for course catalog data.
 *
 * <p>Maps from {@link com.myus.entity.Course} to expose only
 * public-facing fields required by the course browsing API.</p>
 */
public class CourseResponse {

    private Long courseId;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
    private String prerequisites;
    private String department;
    private String semester;
    private Integer capacity;

    public CourseResponse() {
    }

    public CourseResponse(Long courseId,
                          String courseCode,
                          String courseName,
                          String description,
                          Integer credits,
                          String prerequisites,
                          String department,
                          String semester,
                          Integer capacity) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.credits = credits;
        this.prerequisites = prerequisites;
        this.department = department;
        this.semester = semester;
        this.capacity = capacity;
    }

    // ── Getters & Setters ──────────────────────────────────────

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public String getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(String prerequisites) {
        this.prerequisites = prerequisites;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}
