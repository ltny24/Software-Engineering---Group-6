package com.myus.exception;

/**
 * Business exception thrown when a bulk data upload cannot be read or does not
 * follow the required structure (e.g., malformed CSV or missing required
 * columns).
 *
 * <p>Handled by {@link GlobalExceptionHandler} and mapped to HTTP 400 Bad Request.</p>
 */
public class BulkImportException extends RuntimeException {

    public BulkImportException(String message) {
        super(message);
    }
}
