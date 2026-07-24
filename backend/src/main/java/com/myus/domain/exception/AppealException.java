package com.myus.domain.exception;

/**
 * Exception thrown when an appeal business rule is violated.
 *
 * <p>Examples include:</p>
 * <ul>
 *   <li>Attempting to submit a duplicate appeal for the same grade</li>
 *   <li>Invalid status transition (e.g., trying to approve an already denied appeal)</li>
 *   <li>Attempting to withdraw an appeal that is no longer in "Submitted" status</li>
 * </ul>
 *
 * <p>Handled by {@link GlobalExceptionHandler} and mapped to HTTP 409 Conflict.</p>
 */
public class AppealException extends RuntimeException {

    public AppealException(String message) {
        super(message);
    }
}
