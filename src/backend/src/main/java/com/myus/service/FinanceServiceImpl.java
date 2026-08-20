package com.myus.service;

import com.myus.dto.TuitionBalanceResponse;
import com.myus.dto.TuitionPaymentResponse;
import com.myus.entity.Student;
import com.myus.entity.TuitionAccount;
import com.myus.entity.TuitionPayment;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.StudentRepository;
import com.myus.repository.TuitionAccountRepository;
import com.myus.repository.TuitionPaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Default implementation for tuition and payment history retrieval.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class FinanceServiceImpl implements FinanceService {

    private final StudentRepository studentRepository;
    private final TuitionAccountRepository tuitionAccountRepository;
    private final TuitionPaymentRepository tuitionPaymentRepository;

    public FinanceServiceImpl(StudentRepository studentRepository,
                              TuitionAccountRepository tuitionAccountRepository,
                              TuitionPaymentRepository tuitionPaymentRepository) {
        this.studentRepository = studentRepository;
        this.tuitionAccountRepository = tuitionAccountRepository;
        this.tuitionPaymentRepository = tuitionPaymentRepository;
    }

    @Override
    public TuitionBalanceResponse getTuitionBalance(String username) {
        log.debug("Loading tuition balance for username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for username: " + username));

        List<TuitionAccount> tuitionAccounts = tuitionAccountRepository.findByStudentStudentId(student.getStudentId());
        List<TuitionPaymentResponse> paymentHistory = getPaymentHistory(username);

        TuitionAccount latestAccount = tuitionAccounts.stream()
                .filter(Objects::nonNull)
                .max(Comparator.comparing(TuitionAccount::getAccountId))
                .orElse(null);

        BigDecimal totalCharges = tuitionAccounts.stream()
                .map(TuitionAccount::getTotalCharges)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal payments = tuitionAccounts.stream()
                .map(TuitionAccount::getPayments)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal scholarshipAmount = tuitionAccounts.stream()
                .map(TuitionAccount::getScholarshipAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = tuitionAccounts.stream()
                .map(TuitionAccount::getBalance)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean financialHold = tuitionAccounts.stream()
                .anyMatch(TuitionAccount::getFinancialHold);

        TuitionBalanceResponse response = new TuitionBalanceResponse(
                student.getStudentId(),
                latestAccount != null ? latestAccount.getTerm() : null,
                totalCharges,
                payments,
                scholarshipAmount,
                balance,
                financialHold,
                paymentHistory
        );

        log.info("Loaded tuition balance for studentId={}", student.getStudentId());
        return response;
    }

    @Override
    public List<TuitionPaymentResponse> getPaymentHistory(String username) {
        log.debug("Loading payment history for username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for username: " + username));

        List<TuitionPayment> payments = tuitionPaymentRepository.findByTuitionAccountStudentStudentId(student.getStudentId());

        return payments.stream()
                .sorted(Comparator.comparing(TuitionPayment::getPaymentDate).reversed())
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    private TuitionPaymentResponse mapToPaymentResponse(TuitionPayment payment) {
        return new TuitionPaymentResponse(
                payment.getPaymentId(),
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getPaymentMethod(),
                payment.getReferenceNumber(),
                payment.getStatus()
        );
    }
}
