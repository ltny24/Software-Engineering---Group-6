package com.myus.exception;

/**
 * Business exception thrown when a class transfer cannot be completed due to a
 * domain rule violation (e.g., invalid source/target section, no active
 * enrollment, or a validation check that was not overridden).
 *
 * <p>Handled by {@link GlobalExceptionHandler} and mapped to HTTP 409 Conflict.</p>
 */
public class ClassTransferException extends RuntimeException {

    public ClassTransferException(String message) {
        super(message);
    }
}
