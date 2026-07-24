package com.myus.interfaces.rest;

import com.myus.application.dto.TuitionBalanceResponse;
import com.myus.application.service.TuitionService;
import com.myus.infrastructure.security.IsStudent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * REST controller for student tuition / finance operations.
 *
 * <p>All endpoints require the {@code STUDENT} role.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/finance")
public class TuitionController {

    private final TuitionService tuitionService;

    public TuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    /**
     * Retrieve the tuition balance and payment history for the authenticated student.
     *
     * @param principal the authenticated principal (injected from JWT)
     * @return tuition balance response DTO
     */
    @GetMapping("/tuition/balance")
    @IsStudent
    public ResponseEntity<TuitionBalanceResponse> getTuitionBalance(Principal principal) {
        String username = principal.getName();
        log.debug("GET /api/v1/finance/tuition/balance – username={}", username);

        TuitionBalanceResponse response = tuitionService.getTuitionBalance(username);
        return ResponseEntity.ok(response);
    }
}
