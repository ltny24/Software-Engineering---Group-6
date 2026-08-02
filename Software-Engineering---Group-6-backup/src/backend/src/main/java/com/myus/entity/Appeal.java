package com.myus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Appeal", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appealId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gradeId")
    private Grade grade;

    private LocalDateTime submittedAt;

    @Column(nullable = false, length = 50)
    private String status = "Submitted";

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String appealReason;

    @Column(length = 2048)
    private String supportingDocumentUrl;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String reviewerComments;

    private LocalDateTime deadline;

    private LocalDateTime resolvedAt;

    @Column(length = 50)
    private String resolutionCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewerAdminId")
    private Administrator reviewerAdmin;

}
