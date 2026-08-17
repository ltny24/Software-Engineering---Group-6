package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A student enrolled in a course offering's roster (FG7 – Class Transfer).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RosterStudent {

    private Long studentId;
    private String username;
    private String fullName;
}
