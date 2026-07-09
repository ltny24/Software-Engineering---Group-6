package com.myus.service;

import com.myus.entity.Course;
import com.myus.repository.CourseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    @Test
    void getAllCoursesReturnsAllCoursesFromRepository() {
        Course course = new Course();
        course.setCourseId(10L);
        course.setCourseCode("CS101");
        course.setCourseName("Intro to Programming");

        when(courseRepository.findAll()).thenReturn(List.of(course));

        List<Course> courses = courseService.getAllCourses();

        assertThat(courses).hasSize(1);
        assertThat(courses.get(0).getCourseCode()).isEqualTo("CS101");
    }

    @Test
    void getCourseByIdReturnsCourseWhenPresent() {
        Course course = new Course();
        course.setCourseId(10L);
        course.setCourseCode("CS101");
        course.setCourseName("Intro to Programming");

        when(courseRepository.findById(10L)).thenReturn(Optional.of(course));

        Optional<Course> result = courseService.getCourseById(10L);

        assertThat(result).isPresent();
        assertThat(result.get().getCourseName()).isEqualTo("Intro to Programming");
    }
}
