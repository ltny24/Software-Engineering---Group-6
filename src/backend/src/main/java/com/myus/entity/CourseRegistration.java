package com.myus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "CourseRegistration", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offeringId", nullable = false)
    private CourseOffering offering;

    @Column(nullable = false, length = 50)
    private String status = "Requested";

    private LocalDateTime registeredAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gradeId")
    private Grade grade;

}
