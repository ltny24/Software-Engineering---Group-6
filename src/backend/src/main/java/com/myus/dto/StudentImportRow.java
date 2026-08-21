package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single parsed row from a bulk student-import upload (one Student).
 *
 * <p>Represents the expected CSV columns for a student record:
 * {@code username, password, firstName, middleName, lastName, email, phone,
 * address, dateOfBirth, studentType, major, enrollmentStatus, registrationStatus}.
 * Required columns are {@code username, password, firstName, lastName, email}.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentImportRow {

    private String username;
    private String password;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String dateOfBirth;
    private String studentType;
    private String major;
    private String enrollmentStatus;
    private String registrationStatus;
}
