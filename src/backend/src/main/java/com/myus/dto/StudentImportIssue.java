package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * A bulk student-import row that failed validation, together with the list of
 * human-readable errors describing why it was rejected.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentImportIssue {

    /** 1-based row number in the uploaded file (header excluded). */
    private int rowNumber;

    private String username;
    private String firstName;
    private String lastName;
    private String email;

    private List<String> errors = new ArrayList<>();
}
