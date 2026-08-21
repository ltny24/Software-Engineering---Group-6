package com.myus.dto;

/**
 * Response DTO for {@code POST /api/auth/forgot-password}.
 * Returns the masked email the code was sent to.
 * In demo mode, also returns the verification code for easy testing.
 */
public class ForgotPasswordResponse {

    private String message;
    private String maskedEmail;
    private String verificationCode; // Only for demo/testing

    public ForgotPasswordResponse() {}

    public ForgotPasswordResponse(String message, String maskedEmail, String verificationCode) {
        this.message = message;
        this.maskedEmail = maskedEmail;
        this.verificationCode = verificationCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMaskedEmail() {
        return maskedEmail;
    }

    public void setMaskedEmail(String maskedEmail) {
        this.maskedEmail = maskedEmail;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}
