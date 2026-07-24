package com.myus.interfaces.rest;

import com.myus.application.dto.CourseOfferingResponse;
import com.myus.application.service.CourseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for course catalog browsing (T018).
 *
 * <p>Exposes endpoints for authenticated users to browse, search,
 * and filter the course catalog. All responses are paginated.</p>
 *
 * <p>API contract reference: {@code GET /api/courses}</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * Browse available course offerings with optional search and filters.
     *
     * <p>Query parameters:</p>
     * <ul>
     *   <li>{@code page} – zero-based page index (default: 0)</li>
     *   <li>{@code size} – items per page (default: 20)</li>
     *   <li>{@code search} – keyword to search by course code or name</li>
     *   <li>{@code department} – filter by department</li>
     *   <li>{@code term} – filter by term/semester</li>
     * </ul>
     *
     * @return paginated list of course offerings
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<CourseOfferingResponse>> browseCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String term) {

        log.debug("GET /api/courses – page={}, size={}, search={}, department={}, term={}",
                page, size, search, department, term);

        Page<CourseOfferingResponse> courses = courseService.browseCourses(page, size, search, department, term);
        return ResponseEntity.ok(courses);
    }

    /**
     * Retrieve a single course offering by its ID.
     *
     * @param offeringId the offering ID
     * @return the course offering details
     */
    @GetMapping("/{offeringId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseOfferingResponse> getOfferingById(
            @PathVariable Long offeringId) {

        log.debug("GET /api/courses/{}", offeringId);

        CourseOfferingResponse offering = courseService.getOfferingById(offeringId);
        return ResponseEntity.ok(offering);
    }
}
