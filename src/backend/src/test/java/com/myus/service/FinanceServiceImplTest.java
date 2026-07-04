package com.myus.service;

import com.myus.dto.TuitionBalanceResponse;
import com.myus.entity.Student;
import com.myus.entity.TuitionAccount;
import com.myus.entity.TuitionPayment;
import com.myus.repository.StudentRepository;
import com.myus.repository.TuitionAccountRepository;
import com.myus.repository.TuitionPaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FinanceServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private TuitionAccountRepository tuitionAccountRepository;

    @Mock
    private TuitionPaymentRepository tuitionPaymentRepository;

    @InjectMocks
    private FinanceServiceImpl financeService;

    @Test
    void getTuitionBalanceReturnsAggregatedSummaryForStudent() {
        Student student = new Student();
        student.setStudentId(7L);
        student.setUsername("student1");

        TuitionAccount account = new TuitionAccount();
        account.setAccountId(11L);
        account.setStudent(student);
        account.setTerm("2024-2025");
        account.setTotalCharges(new BigDecimal("1200.00"));
        account.setPayments(new BigDecimal("900.00"));
        account.setScholarshipAmount(new BigDecimal("100.00"));
        account.setBalance(new BigDecimal("200.00"));
        account.setFinancialHold(false);

        TuitionPayment payment = new TuitionPayment();
        payment.setPaymentId(21L);
        payment.setTuitionAccount(account);
        payment.setAmount(new BigDecimal("900.00"));
        payment.setPaymentDate(LocalDateTime.of(2024, 9, 15, 10, 0));
        payment.setPaymentMethod("BANK_TRANSFER");
        payment.setReferenceNumber("TXN-001");
        payment.setStatus("COMPLETED");

        when(studentRepository.findByUsername("student1")).thenReturn(Optional.of(student));
        when(tuitionAccountRepository.findByStudentStudentId(7L)).thenReturn(List.of(account));
        when(tuitionPaymentRepository.findByTuitionAccountStudentStudentId(7L)).thenReturn(List.of(payment));

        TuitionBalanceResponse response = financeService.getTuitionBalance("student1");

        assertThat(response.getStudentId()).isEqualTo(7L);
        assertThat(response.getBalance()).isEqualByComparingTo("200.00");
        assertThat(response.getTotalCharges()).isEqualByComparingTo("1200.00");
        assertThat(response.getPaymentHistory()).hasSize(1);
    }
}
