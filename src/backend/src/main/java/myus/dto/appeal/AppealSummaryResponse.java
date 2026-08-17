package myus.dto.appeal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppealSummaryResponse {
    private Long appealId;
    private String trackingCode;
    private String status;
    private Double currentGrade;
    private Double expectedGrade;
    private String courseCode;
    private String courseName;
    private String examType;
    private String feeStatus;
    private LocalDateTime createdAt;
    private LocalDateTime feePaymentDeadline;
}
