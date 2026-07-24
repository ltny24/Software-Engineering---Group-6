package com.myus.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ClassTransferRequest", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassTransferRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transferId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fromOfferingId", nullable = false)
    private CourseOffering fromOffering;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "toOfferingId", nullable = false)
    private CourseOffering toOffering;

    private LocalDateTime requestDate;

    @Column(nullable = false, length = 50)
    private String status = "Requested";

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String reviewerComments;

}
