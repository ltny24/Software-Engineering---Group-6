package com.myus.dto;
import lombok.Data;
@Data
public class ExamScheduleResponse {
    private Long examId;
    private Long courseId;
    private String courseName;
    private java.time.LocalDateTime examDate;
    private String room;
    private String examType;
}
