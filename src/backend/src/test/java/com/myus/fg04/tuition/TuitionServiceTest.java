package com.myus.fg04.tuition;

import com.myus.dto.TuitionBalanceResponse;
import com.myus.entity.Student;
import com.myus.entity.TuitionAccount;
import com.myus.repository.StudentRepository;
import com.myus.repository.TuitionAccountRepository;
import com.myus.service.FinanceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("FG04 – Tuition: Service Layer Tests")
class TuitionServiceTest {

    @Mock
    private TuitionAccountRepository tuitionAccountRepository;
    @Mock
    private com.myus.repository.TuitionPaymentRepository tuitionPaymentRepository;
    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private FinanceServiceImpl financeService;

    private Student mockStudent;
    private TuitionAccount mockAccount;

    @BeforeEach
    void setUp() {
        mockStudent = new Student();
        mockStudent.setStudentId(1L);
        mockStudent.setUsername("SV001");

        mockAccount = new TuitionAccount();
        mockAccount.setAccountId(101L);
        mockAccount.setStudent(mockStudent);
        mockAccount.setTerm("2024-HK1");
        mockAccount.setTotalCharges(new BigDecimal("15000000"));
        mockAccount.setPayments(new BigDecimal("5000000"));
        mockAccount.setBalance(new BigDecimal("10000000"));
        mockAccount.setFinancialHold(false);
    }

    @Test
    @DisplayName("TC_TUI_01: getTuitionBalance returns correct balance")
    void getTuitionBalance_returnsCorrectBalance() {
        when(studentRepository.findByUsername("SV001")).thenReturn(Optional.of(mockStudent));
        when(tuitionAccountRepository.findByStudentStudentId(1L)).thenReturn(List.of(mockAccount));

        TuitionBalanceResponse response = financeService.getTuitionBalance("SV001");

        assertThat(response).isNotNull();
        assertThat(response.getBalance()).isEqualByComparingTo(new BigDecimal("10000000"));
    }
}
