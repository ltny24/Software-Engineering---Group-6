package com.myus.controller;

import com.myus.dto.TuitionBalanceResponse;
import com.myus.dto.TuitionPaymentResponse;
import com.myus.service.FinanceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * Controller for student tuition balance and payment history endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/finance")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/tuition/balance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TuitionBalanceResponse> getTuitionBalance(Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized access attempt to tuition balance endpoint without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getName();
        log.debug("Loading tuition balance for authenticated student username={}", username);

        TuitionBalanceResponse response = financeService.getTuitionBalance(username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tuition/payment-history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<TuitionPaymentResponse>> getPaymentHistory(Principal principal) {

        if (principal == null) {
            log.warn("Unauthorized access attempt to payment history endpoint without authenticated principal.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = principal.getName();
        log.debug("Loading payment history for authenticated student username={}", username);

        List<TuitionPaymentResponse> response = financeService.getPaymentHistory(username);
        return ResponseEntity.ok(response);
    }
}
