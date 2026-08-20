package com.myus.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO representing a tuition payment entry in the student's payment history.
 */
public class TuitionPaymentResponse {

    private Long paymentId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String referenceNumber;
    private String status;

    public TuitionPaymentResponse() {
    }

    public TuitionPaymentResponse(Long paymentId,
                                  BigDecimal amount,
                                  LocalDateTime paymentDate,
                                  String paymentMethod,
                                  String referenceNumber,
                                  String status) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.status = status;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
