package com.myus.service;

import com.myus.entity.Course;

import java.util.List;
import java.util.Optional;

public interface CourseService {
    List<Course> getAllCourses();

    Optional<Course> getCourseById(Long courseId);
}
