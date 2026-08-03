package com.myus.entity;
import lombok.Data;
import jakarta.persistence.*;
@Entity
@Data
public class ExamSchedule { @Id private Long id; private CourseOffering courseOffering; private java.time.LocalDateTime examDate; private String room; }
