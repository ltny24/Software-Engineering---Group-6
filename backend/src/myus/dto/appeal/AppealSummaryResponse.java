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
    private String courseCode;
    private String courseName;
    private String examType;
    private Double currentGrade;
    private Double expectedGrade;
    private String status; // PENDING, PROCESSING, RESOLVED, REJECTED, CANCELED
    private String feeStatus; // UNPAID, PAID, EXEMPTED
    private LocalDateTime feePaymentDeadline;
    private LocalDateTime createdAt;
}
