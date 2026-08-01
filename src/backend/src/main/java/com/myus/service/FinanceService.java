package com.myus.service;

import com.myus.dto.TuitionBalanceResponse;
import com.myus.dto.TuitionPaymentResponse;

import java.util.List;

/**
 * Service contract for student finance and tuition operations.
 */
public interface FinanceService {

    TuitionBalanceResponse getTuitionBalance(String username);

    List<TuitionPaymentResponse> getPaymentHistory(String username);
}
