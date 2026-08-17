package com.myus.fg01.profile;

import com.myus.dto.StudentProfileUpdateRequest;
import com.myus.dto.StudentProfileResponse;
import com.myus.entity.Student;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.StudentRepository;
import com.myus.service.ProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FG01 – Student Profile Update: Service Layer Tests")
class StudentProfileServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private ProfileServiceImpl profileService;

    private Student mockStudent;

    @BeforeEach
    void setUp() {
        mockStudent = new Student();
        mockStudent.setStudentId(1L);
        mockStudent.setUsername("SV001");
        mockStudent.setEmail("sv001@myus.edu.vn");
        mockStudent.setPhone("0912345678");
        mockStudent.setAddress("123 Le Loi, Quan 1, TP.HCM");
        mockStudent.setFirstName("Nguyen");
        mockStudent.setMiddleName("Van");
        mockStudent.setLastName("A");
    }

    @Test
    @DisplayName("TC_PROF_01: update valid phone number")
    void TC_PROF_01_updatePhone_validPhone_returnsUpdatedProfile() {
        StudentProfileUpdateRequest request = new StudentProfileUpdateRequest();
        request.setPhone("0912345678");
        request.setAddress(mockStudent.getAddress());

        when(studentRepository.findByUsername("SV001")).thenReturn(Optional.of(mockStudent));
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        StudentProfileResponse response = profileService.updateProfile("SV001", request);

        assertThat(response).isNotNull();
        assertThat(response.getPhone()).isEqualTo("0912345678");
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    @DisplayName("TC_PROF_02: email field is NOT updated via StudentProfileUpdateRequest (read-only)")
    void TC_PROF_02_updateProfile_emailFieldNotChanged() {
        StudentProfileUpdateRequest request = new StudentProfileUpdateRequest();
        request.setPhone("0987654321");
        request.setAddress(mockStudent.getAddress());

        when(studentRepository.findByUsername("SV001")).thenReturn(Optional.of(mockStudent));
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        profileService.updateProfile("SV001", request);

        verify(studentRepository).save(argThat(s -> "sv001@myus.edu.vn".equals(s.getEmail())));
    }
}
