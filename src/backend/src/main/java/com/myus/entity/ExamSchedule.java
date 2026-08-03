package com.myus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ExamSchedule", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offeringId")
    private CourseOffering courseOffering;

    @Column(length = 50)
    private String term;

    @Column(length = 50)
    private String type;

    private LocalDateTime examDate;

    @Column(length = 100)
    private String room;
}
