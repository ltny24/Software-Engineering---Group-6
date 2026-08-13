package com.myus.exception;

/**
 * Business exception thrown when a master-schedule upload cannot be read or
 * does not follow the required structure (e.g., malformed CSV or missing
 * required columns).
 *
 * <p>Handled by {@link GlobalExceptionHandler} and mapped to HTTP 400 Bad Request.</p>
 */
public class ScheduleImportException extends RuntimeException {

    public ScheduleImportException(String message) {
        super(message);
    }
}
