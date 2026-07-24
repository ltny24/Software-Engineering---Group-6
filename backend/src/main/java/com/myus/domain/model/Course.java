package com.myus.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Course", schema = "myus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    @Column(nullable = false, length = 50, unique = true)
    private String courseCode;

    @Column(nullable = false, length = 255)
    private String courseName;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    private Integer credits;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String prerequisites;

    @Column(length = 255)
    private String department;

    @Column(length = 100)
    private String semester;

    private Integer capacity;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseOffering> offerings = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Grade> grades = new ArrayList<>();

}
