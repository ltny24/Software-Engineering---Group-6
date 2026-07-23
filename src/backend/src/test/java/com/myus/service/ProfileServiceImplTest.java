package com.myus.service;

import com.myus.dto.StudentProfileResponse;
import com.myus.dto.StudentProfileUpdateRequest;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private ProfileServiceImpl profileService;

    @Test
    void updateProfileUpdatesAllowedFieldsAndSavesStudent() {
        Student student = new Student();
        student.setStudentId(1L);
        student.setUsername("student1");
        student.setEmail("student1@example.com");
        student.setFirstName("Ada");
        student.setMiddleName("L");
        student.setLastName("Lovelace");
        student.setPhone("123456");
        student.setAddress("Old Address");
        student.setDateOfBirth(LocalDate.of(2000, 1, 1));
        student.setStudentType("UNDERGRADUATE");
        student.setMajor("Computer Science");
        student.setEnrollmentStatus("ACTIVE");
        student.setRegistrationStatus("REGISTERED");

        StudentProfileUpdateRequest request = new StudentProfileUpdateRequest();
        request.setPhone("999999");
        request.setAddress("New Address");

        when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StudentProfileResponse response = profileService.updateProfile("student1", request);

        assertThat(response.getPhone()).isEqualTo("999999");
        assertThat(response.getAddress()).isEqualTo("New Address");
        assertThat(response.getUsername()).isEqualTo("student1");
        assertThat(student.getUpdatedAt()).isNotNull();
        verify(studentRepository).save(student);
    }

    @Test
    void updateProfileThrowsWhenStudentDoesNotExist() {
        when(studentRepository.findByUsername("missing")).thenReturn(Optional.empty());

        StudentProfileUpdateRequest request = new StudentProfileUpdateRequest();
        request.setPhone("123456");

        assertThatThrownBy(() -> profileService.updateProfile("missing", request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("missing");
    }
}
