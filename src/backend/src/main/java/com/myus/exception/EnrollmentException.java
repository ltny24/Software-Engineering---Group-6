package com.myus.exception;

/**
 * Business exception thrown when a course enrollment operation
 * cannot be completed due to a domain rule violation.
 *
 * <p>Examples: offering is full, duplicate registration,
 * or attempting to drop an already-dropped enrollment.</p>
 *
 * <p>Handled by {@link GlobalExceptionHandler} and mapped
 * to HTTP 409 Conflict.</p>
 */
public class EnrollmentException extends RuntimeException {

    public EnrollmentException(String message) {
        super(message);
    }
}
