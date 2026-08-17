package com.myus.repository;

import com.myus.entity.ClassTransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for {@link ClassTransferRequest} entities (FG7 – Class Transfer).
 *
 * <p>Stores an audit record for every student class transfer performed by an
 * administrator, in line with UC-14's requirement that each transfer be logged
 * with the administrator, timestamp, and reason.</p>
 */
@Repository
public interface ClassTransferRequestRepository extends JpaRepository<ClassTransferRequest, Long> {

    /**
     * Fetch all transfer records with their student and offering relationships
     * eagerly loaded (avoids N+1 / lazy-initialization issues when mapping DTOs).
     * Ordered newest first.
     */
    @Query("SELECT t FROM ClassTransferRequest t " +
            "JOIN FETCH t.student s " +
            "JOIN FETCH t.fromOffering fo " +
            "JOIN FETCH t.toOffering to " +
            "JOIN FETCH fo.course fc " +
            "JOIN FETCH to.course tc " +
            "ORDER BY t.requestDate DESC")
    List<ClassTransferRequest> findAllWithDetails();

    /**
     * Fetch all transfer records originating from a specific offering.
     */
    @Query("SELECT t FROM ClassTransferRequest t " +
            "WHERE t.fromOffering.offeringId = :offeringId " +
            "ORDER BY t.requestDate DESC")
    List<ClassTransferRequest> findByFromOfferingOfferingId(@Param("offeringId") Long offeringId);

    /**
     * Fetch all transfer records targeting a specific offering.
     */
    @Query("SELECT t FROM ClassTransferRequest t " +
            "WHERE t.toOffering.offeringId = :offeringId " +
            "ORDER BY t.requestDate DESC")
    List<ClassTransferRequest> findByToOfferingOfferingId(@Param("offeringId") Long offeringId);
}
