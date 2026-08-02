package com.myus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "Grade", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gradeId;

    @OneToOne(mappedBy = "grade", fetch = FetchType.LAZY)
    private CourseRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @Column(nullable = false, length = 10)
    private String gradeValue;

    @Column(precision = 4, scale = 2)
    private BigDecimal gradePoint;

    @Column(length = 50)
    private String term;

    @Column(precision = 5, scale = 4)
    private BigDecimal gpaImpact;

}
