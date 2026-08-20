package com.myus.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for tuition balance summary returned to students.
 */
public class TuitionBalanceResponse {

    private Long studentId;
    private String term;
    private BigDecimal totalCharges;
    private BigDecimal payments;
    private BigDecimal scholarshipAmount;
    private BigDecimal balance;
    private Boolean financialHold;
    private List<TuitionPaymentResponse> paymentHistory;

    public TuitionBalanceResponse() {
    }

    public TuitionBalanceResponse(Long studentId,
                                  String term,
                                  BigDecimal totalCharges,
                                  BigDecimal payments,
                                  BigDecimal scholarshipAmount,
                                  BigDecimal balance,
                                  Boolean financialHold,
                                  List<TuitionPaymentResponse> paymentHistory) {
        this.studentId = studentId;
        this.term = term;
        this.totalCharges = totalCharges;
        this.payments = payments;
        this.scholarshipAmount = scholarshipAmount;
        this.balance = balance;
        this.financialHold = financialHold;
        this.paymentHistory = paymentHistory;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public BigDecimal getTotalCharges() {
        return totalCharges;
    }

    public void setTotalCharges(BigDecimal totalCharges) {
        this.totalCharges = totalCharges;
    }

    public BigDecimal getPayments() {
        return payments;
    }

    public void setPayments(BigDecimal payments) {
        this.payments = payments;
    }

    public BigDecimal getScholarshipAmount() {
        return scholarshipAmount;
    }

    public void setScholarshipAmount(BigDecimal scholarshipAmount) {
        this.scholarshipAmount = scholarshipAmount;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Boolean getFinancialHold() {
        return financialHold;
    }

    public void setFinancialHold(Boolean financialHold) {
        this.financialHold = financialHold;
    }

    public List<TuitionPaymentResponse> getPaymentHistory() {
        return paymentHistory;
    }

    public void setPaymentHistory(List<TuitionPaymentResponse> paymentHistory) {
        this.paymentHistory = paymentHistory;
    }
}
