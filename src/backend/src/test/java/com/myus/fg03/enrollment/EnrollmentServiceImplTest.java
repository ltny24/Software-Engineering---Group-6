package com.myus.fg03.enrollment;

import com.myus.dto.EnrollmentRequest;
import com.myus.dto.EnrollmentResponse;
import com.myus.entity.Course;
import com.myus.entity.CourseOffering;
import com.myus.entity.CourseRegistration;
import com.myus.entity.Student;
import com.myus.exception.EnrollmentException;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.CourseOfferingRepository;
import com.myus.repository.CourseRegistrationRepository;
import com.myus.repository.StudentRepository;
import com.myus.service.EnrollmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EnrollmentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseOfferingRepository offeringRepository;

    @Mock
    private CourseRegistrationRepository registrationRepository;

    @InjectMocks
    private EnrollmentServiceImpl enrollmentService;

    private Student student;
    private Course course;
    private CourseOffering offering;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setStudentId(1L);
        student.setUsername("teststudent");

        course = new Course();
        course.setCourseId(10L);
        course.setCourseCode("CSC1001");
        course.setCredits(4);
        course.setCapacity(40);

        offering = new CourseOffering();
        offering.setOfferingId(100L);
        offering.setCourse(course);
        offering.setTerm("HKI 2025-2026");
    }

    @Test
    void registerCourse_Success() {
        EnrollmentRequest request = new EnrollmentRequest();
        request.setOfferingId(100L);

        when(studentRepository.findByUsername("teststudent")).thenReturn(Optional.of(student));
        when(offeringRepository.findById(100L)).thenReturn(Optional.of(offering));
        when(registrationRepository.findActiveByStudentAndOffering(1L, 100L)).thenReturn(Optional.empty());
        when(registrationRepository.countActiveByOfferingId(100L)).thenReturn(10L);
        when(registrationRepository.findByStudentIdWithOfferingAndCourse(1L)).thenReturn(List.of());

        CourseRegistration savedRegistration = new CourseRegistration();
        savedRegistration.setRegistrationId(500L);
        savedRegistration.setStudent(student);
        savedRegistration.setOffering(offering);
        savedRegistration.setStatus("Enrolled");
        when(registrationRepository.save(any(CourseRegistration.class))).thenReturn(savedRegistration);

        EnrollmentResponse response = enrollmentService.registerCourse("teststudent", request);

        assertNotNull(response);
        assertEquals(500L, response.getRegistrationId());
        assertEquals("Enrolled", response.getStatus());
        verify(registrationRepository, times(1)).save(any(CourseRegistration.class));
    }

    @Test
    void registerCourse_Duplicate_ThrowsException() {
        EnrollmentRequest request = new EnrollmentRequest();
        request.setOfferingId(100L);

        CourseRegistration existing = new CourseRegistration();
        existing.setRegistrationId(999L);
        existing.setStatus("Enrolled");

        when(studentRepository.findByUsername("teststudent")).thenReturn(Optional.of(student));
        when(offeringRepository.findById(100L)).thenReturn(Optional.of(offering));
        when(registrationRepository.findActiveByStudentAndOffering(1L, 100L)).thenReturn(Optional.of(existing));

        EnrollmentException exception = assertThrows(EnrollmentException.class, () ->
                enrollmentService.registerCourse("teststudent", request));
        assertTrue(exception.getMessage().contains("already registered"));
    }

    @Test
    void registerCourse_CapacityFull_ThrowsException() {
        EnrollmentRequest request = new EnrollmentRequest();
        request.setOfferingId(100L);
        course.setCapacity(40);

        when(studentRepository.findByUsername("teststudent")).thenReturn(Optional.of(student));
        when(offeringRepository.findById(100L)).thenReturn(Optional.of(offering));
        when(registrationRepository.findActiveByStudentAndOffering(1L, 100L)).thenReturn(Optional.empty());
        when(registrationRepository.countActiveByOfferingId(100L)).thenReturn(40L);

        EnrollmentException exception = assertThrows(EnrollmentException.class, () ->
                enrollmentService.registerCourse("teststudent", request));
        assertTrue(exception.getMessage().contains("Course offering is full"));
    }

    @Test
    void registerCourse_CreditLimitExceeded_ThrowsException() {
        EnrollmentRequest request = new EnrollmentRequest();
        request.setOfferingId(100L);
        course.setCredits(4);

        CourseRegistration r1 = new CourseRegistration();
        CourseOffering o1 = new CourseOffering();
        o1.setTerm("HKI 2025-2026");
        Course c1 = new Course();
        c1.setCredits(22);
        o1.setCourse(c1);
        r1.setOffering(o1);
        r1.setStatus("Enrolled");

        when(studentRepository.findByUsername("teststudent")).thenReturn(Optional.of(student));
        when(offeringRepository.findById(100L)).thenReturn(Optional.of(offering));
        when(registrationRepository.findActiveByStudentAndOffering(1L, 100L)).thenReturn(Optional.empty());
        when(registrationRepository.countActiveByOfferingId(100L)).thenReturn(10L);
        when(registrationRepository.findByStudentIdWithOfferingAndCourse(1L)).thenReturn(List.of(r1));

        EnrollmentException exception = assertThrows(EnrollmentException.class, () ->
                enrollmentService.registerCourse("teststudent", request));
        assertTrue(exception.getMessage().contains("Credit limit exceeded"));
    }

    @Test
    void dropRegistration_Success() {
        CourseRegistration existing = new CourseRegistration();
        existing.setRegistrationId(500L);
        existing.setStudent(student);
        existing.setOffering(offering);
        existing.setStatus("Enrolled");

        when(studentRepository.findByUsername("teststudent")).thenReturn(Optional.of(student));
        when(registrationRepository.findById(500L)).thenReturn(Optional.of(existing));
        when(registrationRepository.save(any(CourseRegistration.class))).thenReturn(existing);

        EnrollmentResponse response = enrollmentService.dropRegistration("teststudent", 500L);

        assertEquals("Dropped", response.getStatus());
        assertEquals("Dropped", existing.getStatus());
        verify(registrationRepository, times(1)).save(existing);
    }

    @Test
    void dropRegistration_NotFound_ThrowsException() {
        when(studentRepository.findByUsername("teststudent")).thenReturn(Optional.of(student));
        when(registrationRepository.findById(999L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                enrollmentService.dropRegistration("teststudent", 999L));
        assertTrue(exception.getMessage().contains("not found"));
    }
}
