package com.myus.application.service.impl;

import com.myus.application.dto.TuitionBalanceResponse;
import com.myus.application.dto.TuitionBalanceResponse.TuitionPaymentDTO;
import com.myus.application.service.TuitionService;
import com.myus.domain.exception.ResourceNotFoundException;
import com.myus.domain.model.Student;
import com.myus.domain.model.TuitionAccount;
import com.myus.domain.repository.StudentRepository;
import com.myus.domain.repository.TuitionAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

/**
 * Default implementation for tuition / finance operations.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class TuitionServiceImpl implements TuitionService {

    private static final String DEFAULT_TERM = "2024-2025-HK2";

    private final StudentRepository studentRepository;
    private final TuitionAccountRepository tuitionAccountRepository;

    public TuitionServiceImpl(StudentRepository studentRepository,
                              TuitionAccountRepository tuitionAccountRepository) {
        this.studentRepository = studentRepository;
        this.tuitionAccountRepository = tuitionAccountRepository;
    }

    @Override
    public TuitionBalanceResponse getTuitionBalance(String username) {
        log.debug("Fetching tuition balance for username={}", username);

        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found for username: " + username));

        Long studentId = student.getStudentId();

        // Try to find the student's tuition account for the current term
        TuitionAccount account = tuitionAccountRepository
                .findByStudentStudentIdAndTerm(studentId, DEFAULT_TERM)
                .orElse(null);

        if (account != null) {
            log.debug("Found tuition account id={} for studentId={}, term={}",
                    account.getAccountId(), studentId, DEFAULT_TERM);
            return mapToResponse(studentId, account);
        }

        // No tuition account yet — return zero-balance stub so the frontend doesn't crash
        log.debug("No tuition account found for studentId={}, term={} — returning zero-balance stub",
                studentId, DEFAULT_TERM);
        return emptyResponse(studentId, DEFAULT_TERM);
    }

    private TuitionBalanceResponse mapToResponse(Long studentId, TuitionAccount account) {
        return new TuitionBalanceResponse(
                studentId,
                account.getTerm(),
                account.getTotalCharges(),
                account.getPayments(),
                account.getScholarshipAmount(),
                account.getBalance(),
                account.getFinancialHold(),
                emptyPaymentHistory()
        );
    }

    private TuitionBalanceResponse emptyResponse(Long studentId, String term) {
        return new TuitionBalanceResponse(
                studentId,
                term,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                false,
                emptyPaymentHistory()
        );
    }

    private List<TuitionPaymentDTO> emptyPaymentHistory() {
        return Collections.emptyList();
    }
}
