package com.myus.controller;

import com.myus.dto.FaqFeedbackRequest;
import com.myus.dto.FaqResponse;
import com.myus.service.FaqService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for the centralized FAQ library (T038, UC10).
 *
 * <p>Exposes searchable, categorized access to published FAQ content covering
 * university policies, academic rules, and IT support, so students can
 * self-serve answers without waiting on the helpdesk.</p>
 *
 * <p>API contract reference: {@code GET /api/faq}</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/faq")
public class FaqController {

    private final FaqService faqService;

    public FaqController(FaqService faqService) {
        this.faqService = faqService;
    }

    /**
     * List the distinct categories available in the FAQ library
     * (e.g. Academic Policies, Registration, Grades & Appeals, Tuition, IT/Technical Support).
     */
    @GetMapping("/categories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getCategories() {
        log.debug("GET /api/faq/categories");
        return ResponseEntity.ok(faqService.getCategories());
    }

    /**
     * Search/browse the FAQ library with optional keyword and category filters.
     *
     * <p>Query parameters:</p>
     * <ul>
     *   <li>{@code search} – free-text keyword search, tolerant of typos and synonyms</li>
     *   <li>{@code category} – filter by category</li>
     *   <li>{@code page} – zero-based page index (default: 0)</li>
     *   <li>{@code size} – items per page (default: 20)</li>
     * </ul>
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<FaqResponse>> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("GET /api/faq – search={}, category={}, page={}, size={}", search, category, page, size);

        Page<FaqResponse> results = faqService.search(search, category, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Most helpful FAQ entries, suggested as popular topics when a search
     * returns no matches (AF1 – No Matching Results).
     */
    @GetMapping("/popular")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<FaqResponse>> getPopular(
            @RequestParam(defaultValue = "5") int limit) {

        log.debug("GET /api/faq/popular – limit={}", limit);
        return ResponseEntity.ok(faqService.getPopular(limit));
    }

    /**
     * Retrieve the full answer for a single FAQ entry, including related
     * questions from the same category (AF4).
     */
    @GetMapping("/{faqId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FaqResponse> getById(@PathVariable Long faqId) {
        log.debug("GET /api/faq/{}", faqId);
        return ResponseEntity.ok(faqService.getById(faqId));
    }

    /**
     * Rate an FAQ answer as "Helpful" or "Not Helpful" (AF3).
     */
    @PostMapping("/{faqId}/feedback")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FaqResponse> submitFeedback(
            @PathVariable Long faqId,
            @Valid @RequestBody FaqFeedbackRequest request) {

        log.debug("POST /api/faq/{}/feedback – helpful={}", faqId, request.getHelpful());
        return ResponseEntity.ok(faqService.submitFeedback(faqId, Boolean.TRUE.equals(request.getHelpful())));
    }
}
