package com.myus.application.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for the tuition/finance balance endpoint.
 *
 * <p>Matches the frontend {@code TuitionBalanceResponse} interface.</p>
 */
public class TuitionBalanceResponse {

    private Long studentId;
    private String term;
    private BigDecimal totalCharges;
    private BigDecimal payments;
    private BigDecimal scholarshipAmount;
    private BigDecimal balance;
    private Boolean financialHold;
    private List<TuitionPaymentDTO> paymentHistory;

    public TuitionBalanceResponse() {
    }

    public TuitionBalanceResponse(Long studentId, String term, BigDecimal totalCharges,
                                  BigDecimal payments, BigDecimal scholarshipAmount,
                                  BigDecimal balance, Boolean financialHold,
                                  List<TuitionPaymentDTO> paymentHistory) {
        this.studentId = studentId;
        this.term = term;
        this.totalCharges = totalCharges;
        this.payments = payments;
        this.scholarshipAmount = scholarshipAmount;
        this.balance = balance;
        this.financialHold = financialHold;
        this.paymentHistory = paymentHistory;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public BigDecimal getTotalCharges() { return totalCharges; }
    public void setTotalCharges(BigDecimal totalCharges) { this.totalCharges = totalCharges; }

    public BigDecimal getPayments() { return payments; }
    public void setPayments(BigDecimal payments) { this.payments = payments; }

    public BigDecimal getScholarshipAmount() { return scholarshipAmount; }
    public void setScholarshipAmount(BigDecimal scholarshipAmount) { this.scholarshipAmount = scholarshipAmount; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public Boolean getFinancialHold() { return financialHold; }
    public void setFinancialHold(Boolean financialHold) { this.financialHold = financialHold; }

    public List<TuitionPaymentDTO> getPaymentHistory() { return paymentHistory; }
    public void setPaymentHistory(List<TuitionPaymentDTO> paymentHistory) { this.paymentHistory = paymentHistory; }

    // ── Nested DTO ───────────────────────────────────────────

    /**
     * Individual payment record within the payment history.
     */
    public static class TuitionPaymentDTO {
        private Long paymentId;
        private BigDecimal amount;
        private String paymentDate;
        private String paymentMethod;
        private String referenceNumber;
        private String status;

        public TuitionPaymentDTO() {
        }

        public TuitionPaymentDTO(Long paymentId, BigDecimal amount, String paymentDate,
                                 String paymentMethod, String referenceNumber, String status) {
            this.paymentId = paymentId;
            this.amount = amount;
            this.paymentDate = paymentDate;
            this.paymentMethod = paymentMethod;
            this.referenceNumber = referenceNumber;
            this.status = status;
        }

        public Long getPaymentId() { return paymentId; }
        public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getPaymentDate() { return paymentDate; }
        public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getReferenceNumber() { return referenceNumber; }
        public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
