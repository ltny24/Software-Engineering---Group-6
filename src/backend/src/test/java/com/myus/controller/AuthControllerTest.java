package com.myus.controller;

import com.myus.dto.AuthRequest;
import com.myus.dto.AuthResponse;
import com.myus.entity.Student;
import com.myus.entity.UserRole;
import com.myus.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void loginReturnsStudentTokenAndProfile() {
        Student student = new Student();
        student.setStudentId(42L);
        student.setUsername("24120001");
        student.setEmail("24120001@student.myus.edu.vn");
        student.setFirstName("Thao");
        student.setMiddleName("Khanh");
        student.setLastName("Nguyen");
        student.setRole(UserRole.STUDENT);

        Authentication authenticated = new UsernamePasswordAuthenticationToken(
                student, null, student.getAuthorities());
        when(authenticationManager.authenticate(org.mockito.ArgumentMatchers.any(Authentication.class)))
                .thenReturn(authenticated);
        when(jwtTokenProvider.generateToken(authenticated)).thenReturn("signed-jwt");
        when(jwtTokenProvider.getExpirationMs()).thenReturn(86_400_000L);

        AuthController controller = new AuthController(authenticationManager, jwtTokenProvider);
        ResponseEntity<AuthResponse> response = controller.login(new AuthRequest("24120001", "24120001123"));

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody().getAccessToken()).isEqualTo("signed-jwt");
        assertThat(response.getBody().getUser().getId()).isEqualTo(42L);
        assertThat(response.getBody().getUser().getRole()).isEqualTo("STUDENT");
        assertThat(response.getBody().getUser().getDisplayName()).isEqualTo("Thao Khanh Nguyen");

        ArgumentCaptor<Authentication> request = ArgumentCaptor.forClass(Authentication.class);
        verify(authenticationManager).authenticate(request.capture());
        assertThat(request.getValue().getName()).isEqualTo("24120001");
    }
}
