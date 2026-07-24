package com.myus.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CourseOffering", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long offeringId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @Column(length = 50)
    private String section;

    @Column(length = 100)
    private String term;

    @Column(length = 500)
    private String schedule;

    @Column(length = 255)
    private String instructor;

    @Column(length = 255)
    private String location;

    @Column(length = 100)
    private String room;

    @OneToMany(mappedBy = "offering", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseRegistration> registrations = new ArrayList<>();

}
