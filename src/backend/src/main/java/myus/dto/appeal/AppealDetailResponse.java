package myus.dto.appeal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppealDetailResponse {
    private Long appealId;
    private String trackingCode;
    private String courseCode;
    private String courseName;
    private String examType;
    private Double currentGrade;
    private Double expectedGrade;
    private String status;
    private String feeStatus;
    private LocalDateTime feePaymentDeadline;
    private LocalDateTime createdAt;
    private String reason;
    private String reviewerComments;
    private Double updatedGrade;
    private LocalDateTime resolvedAt;
    private List<String> attachments = new java.util.ArrayList<>();
}
