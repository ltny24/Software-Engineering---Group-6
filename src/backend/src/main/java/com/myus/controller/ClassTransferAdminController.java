package com.myus.controller;

import com.myus.dto.ClassTransferRecordResponse;
import com.myus.dto.ClassTransferRequestDto;
import com.myus.dto.ClassTransferResponse;
import com.myus.dto.CourseOfferingResponse;
import com.myus.dto.OfferingRosterResponse;
import com.myus.security.IsAdministrator;
import com.myus.service.ClassTransferService;
import com.myus.service.CourseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for administrator class-transfer operations (FG7 / UC-14).
 *
 * <p>All endpoints require the {@code ADMINISTRATOR} role via
 * {@link IsAdministrator}.</p>
 *
 * <p>API contract:</p>
 * <ul>
 *   <li>{@code GET  /api/admin/transfers/offerings}              – list offerings (source picker)</li>
 *   <li>{@code GET  /api/admin/transfers/offerings/{id}/roster}  – roster + target sections</li>
 *   <li>{@code GET  /api/admin/transfers/history}                – transfer audit log</li>
 *   <li>{@code POST /api/admin/transfers}                        – perform transfer(s)</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/transfers")
public class ClassTransferAdminController {

    private final ClassTransferService classTransferService;
    private final CourseService courseService;

    public ClassTransferAdminController(ClassTransferService classTransferService,
                                        CourseService courseService) {
        this.classTransferService = classTransferService;
        this.courseService = courseService;
    }

    /**
     * Browse course offerings to pick a source section.
     */
    @GetMapping("/offerings")
    @IsAdministrator
    public ResponseEntity<Page<CourseOfferingResponse>> listOfferings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String term) {

        log.debug("GET /api/admin/transfers/offerings – search={}, term={}", search, term);
        return ResponseEntity.ok(courseService.browseCourses(page, size, search, department, term));
    }

    /**
     * Retrieve a section's roster and candidate target sections.
     */
    @GetMapping("/offerings/{offeringId}/roster")
    @IsAdministrator
    public ResponseEntity<OfferingRosterResponse> getRoster(@PathVariable Long offeringId) {
        log.debug("GET /api/admin/transfers/offerings/{}/roster", offeringId);
        return ResponseEntity.ok(classTransferService.getRoster(offeringId));
    }

    /**
     * Retrieve the class-transfer audit log, newest first.
     */
    @GetMapping("/history")
    @IsAdministrator
    public ResponseEntity<List<ClassTransferRecordResponse>> getTransferHistory() {
        log.debug("GET /api/admin/transfers/history");
        return ResponseEntity.ok(classTransferService.getTransferHistory());
    }

    /**
     * Perform one or more class transfers.
     */
    @PostMapping
    @IsAdministrator
    public ResponseEntity<ClassTransferResponse> transferStudents(
            @RequestBody ClassTransferRequestDto request) {
        log.debug("POST /api/admin/transfers – from={}, to={}, students={}",
                request.getFromOfferingId(), request.getToOfferingId(),
                request.getStudentIds() != null ? request.getStudentIds().size() : 0);
        return ResponseEntity.ok(classTransferService.transferStudents(request));
    }
}
