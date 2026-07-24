package com.myus.application.service;

import com.myus.application.dto.TuitionBalanceResponse;

/**
 * Service contract for tuition / financial operations.
 */
public interface TuitionService {

    /**
     * Retrieve the tuition balance and payment history for the authenticated student.
     *
     * @param username the authenticated student's username
     * @return tuition balance response DTO
     */
    TuitionBalanceResponse getTuitionBalance(String username);
}
