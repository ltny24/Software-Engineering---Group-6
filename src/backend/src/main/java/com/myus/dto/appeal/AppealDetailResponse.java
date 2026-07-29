package com.myus.dto.appeal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AppealDetailResponse extends AppealSummaryResponse {
    private String reason;
    private String reviewerComments;
    private Double updatedGrade;
    private LocalDateTime resolvedAt;
    private List<String> attachments;
}
