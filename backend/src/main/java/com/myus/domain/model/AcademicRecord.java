package com.myus.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "AcademicRecord", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @Column(length = 50, nullable = false)
    private String term;

    @Column(precision = 4, scale = 3)
    private BigDecimal cumulativeGPA;

    private Integer earnedCredits;

}
