package com.myus.dto;

/**
 * Response DTO for a specific course offering (section) within the catalog.
 *
 * <p>Includes nested {@link CourseResponse} so the frontend can display
 * full course metadata alongside offering-specific scheduling details.
 * Also exposes {@code enrolledCount} and {@code availableSeats} to help
 * students make informed registration decisions.</p>
 */
public class CourseOfferingResponse {

    private Long offeringId;
    private String section;
    private String term;
    private String schedule;
    private String instructor;
    private String location;
    private String room;
    private Integer enrolledCount;
    private Integer availableSeats;
    private CourseResponse course;

    public CourseOfferingResponse() {
    }

    public CourseOfferingResponse(Long offeringId,
                                  String section,
                                  String term,
                                  String schedule,
                                  String instructor,
                                  String location,
                                  String room,
                                  Integer enrolledCount,
                                  Integer availableSeats,
                                  CourseResponse course) {
        this.offeringId = offeringId;
        this.section = section;
        this.term = term;
        this.schedule = schedule;
        this.instructor = instructor;
        this.location = location;
        this.room = room;
        this.enrolledCount = enrolledCount;
        this.availableSeats = availableSeats;
        this.course = course;
    }

    // ── Getters & Setters ──────────────────────────────────────

    public Long getOfferingId() {
        return offeringId;
    }

    public void setOfferingId(Long offeringId) {
        this.offeringId = offeringId;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Integer getEnrolledCount() {
        return enrolledCount;
    }

    public void setEnrolledCount(Integer enrolledCount) {
        this.enrolledCount = enrolledCount;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public CourseResponse getCourse() {
        return course;
    }

    public void setCourse(CourseResponse course) {
        this.course = course;
    }
}
