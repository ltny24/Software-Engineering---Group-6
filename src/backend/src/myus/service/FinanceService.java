package myus.service;

import myus.dto.TuitionBalanceResponse;
import myus.dto.TuitionPaymentResponse;

import java.util.List;

/**
 * Service contract for student finance and tuition operations.
 */
public interface FinanceService {

    TuitionBalanceResponse getTuitionBalance(String username);

    List<TuitionPaymentResponse> getPaymentHistory(String username);
}
