package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * A historical class-transfer record (audit log entry) shown on the admin
 * Class Transfer history screen.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassTransferRecordResponse {

    private Long transferId;

    private Long studentId;
    private String studentUsername;
    private String studentName;

    private Long fromOfferingId;
    private String fromSection;

    private Long toOfferingId;
    private String toSection;

    private String courseCode;
    private String courseName;

    private LocalDateTime requestDate;
    private String status;
    private String reviewerComments;
}
