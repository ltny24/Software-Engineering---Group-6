package com.myus.dto;

import java.time.LocalDate;

/**
 * Response DTO for student profile data returned by the profile endpoint.
 */
public class StudentProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String studentType;
    private String major;
    private String enrollmentStatus;
    private String registrationStatus;

    public StudentProfileResponse() {
    }

    public StudentProfileResponse(Long id,
                                  String username,
                                  String email,
                                  String firstName,
                                  String middleName,
                                  String lastName,
                                  String phone,
                                  String address,
                                  LocalDate dateOfBirth,
                                  String studentType,
                                  String major,
                                  String enrollmentStatus,
                                  String registrationStatus) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.studentType = studentType;
        this.major = major;
        this.enrollmentStatus = enrollmentStatus;
        this.registrationStatus = registrationStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getStudentType() {
        return studentType;
    }

    public void setStudentType(String studentType) {
        this.studentType = studentType;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getEnrollmentStatus() {
        return enrollmentStatus;
    }

    public void setEnrollmentStatus(String enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
    }

    public String getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(String registrationStatus) {
        this.registrationStatus = registrationStatus;
    }
}
