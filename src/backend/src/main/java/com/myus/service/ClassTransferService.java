package com.myus.service;

import com.myus.dto.ClassTransferRecordResponse;
import com.myus.dto.ClassTransferRequestDto;
import com.myus.dto.ClassTransferResponse;
import com.myus.dto.OfferingRosterResponse;

import java.util.List;

/**
 * Service contract for administrator class-transfer operations (FG7 / UC-14).
 *
 * <p>Allows an administrator to view a section's roster, see the candidate
 * target sections, and move one or more students between sections of the same
 * course with validation and an audit trail.</p>
 */
public interface ClassTransferService {

    /**
     * Retrieve a course offering's roster: enrolled students and candidate
     * target sections (same course and term).
     *
     * @param offeringId the source offering ID
     * @return the roster response
     */
    OfferingRosterResponse getRoster(Long offeringId);

    /**
     * Retrieve the class-transfer history (audit log), newest first.
     */
    List<ClassTransferRecordResponse> getTransferHistory();

    /**
     * Perform one or more class transfers from a source section to a target section.
     *
     * @param request       the transfer payload
     * @param adminUsername the administrator performing the transfer (audit log)
     * @return a result reporting transferred students and any per-student failures
     */
    ClassTransferResponse transferStudents(ClassTransferRequestDto request, String adminUsername);

    /**
     * Cancel a course offering (mark it {@code Cancelled}) so it is no longer
     * open for enrollment or as a transfer target (UC-14 AF3).
     *
     * @param offeringId the offering to cancel
     */
    void cancelSection(Long offeringId);
}
