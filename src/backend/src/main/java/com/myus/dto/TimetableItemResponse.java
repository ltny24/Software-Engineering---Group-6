package com.myus.dto;
import lombok.Data;
@Data
public class TimetableItemResponse { private Long courseId; private String courseCode; private String courseName; private String schedule; private String room; private String instructor; }
