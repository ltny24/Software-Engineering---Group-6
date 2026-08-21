package com.myus.service;

import com.myus.dto.CourseOfferingResponse;
import com.myus.dto.CourseResponse;
import com.myus.entity.Course;
import com.myus.entity.CourseOffering;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.CourseOfferingRepository;
import com.myus.repository.CourseRegistrationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Default implementation of {@link CourseService}.
 *
 * <p>Handles course catalog browsing with search, filtering, and
 * pagination. All operations are read-only transactions.</p>
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseOfferingRepository offeringRepository;
    private final CourseRegistrationRepository registrationRepository;

    public CourseServiceImpl(CourseOfferingRepository offeringRepository,
                             CourseRegistrationRepository registrationRepository) {
        this.offeringRepository = offeringRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public Page<CourseOfferingResponse> browseCourses(int page, int size,
                                                      String search, String department, String term) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("course.courseCode").ascending());
        log.debug("Browsing courses: page={}, size={}, search={}, department={}, term={}",
                page, size, search, department, term);

        Page<CourseOffering> offerings = fetchOfferings(search, department, term, pageable);

        log.debug("Found {} offerings (total={})", offerings.getNumberOfElements(), offerings.getTotalElements());
        return offerings.map(this::mapToOfferingResponse);
    }

    @Override
    public CourseOfferingResponse getOfferingById(Long offeringId) {
        log.debug("Fetching offering by id={}", offeringId);

        CourseOffering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course offering not found with id: " + offeringId));

        return mapToOfferingResponse(offering);
    }

    // ── Private helpers ────────────────────────────────────────

    /**
     * Fetches offerings using a single unified query that correctly handles
     * any combination of the optional search, department, and term filters.
     */
    private Page<CourseOffering> fetchOfferings(String search, String department,
                                                 String term, Pageable pageable) {
        String searchParam = (search != null && !search.isBlank()) ? search : null;
        String deptParam = (department != null && !department.isBlank()) ? department : null;
        String termParam = (term != null && !term.isBlank()) ? term : null;

        return offeringRepository.searchWithFilters(searchParam, deptParam, termParam, pageable);
    }

    /**
     * Maps a CourseOffering entity to its response DTO,
     * including nested course info and live enrollment counts.
     */
    private CourseOfferingResponse mapToOfferingResponse(CourseOffering offering) {
        CourseResponse courseDto = mapToCourseResponse(offering.getCourse());

        long enrolledCount = registrationRepository.countActiveByOfferingId(offering.getOfferingId());
        int capacity = offering.getCourse().getCapacity() != null ? offering.getCourse().getCapacity() : 0;
        int availableSeats = Math.max(0, capacity - (int) enrolledCount);

        return new CourseOfferingResponse(
                offering.getOfferingId(),
                offering.getSection(),
                offering.getTerm(),
                offering.getSchedule(),
                offering.getInstructor(),
                offering.getLocation(),
                offering.getRoom(),
                offering.getStatus(),
                (int) enrolledCount,
                availableSeats,
                courseDto
        );
    }

    /**
     * Maps a Course entity to its response DTO.
     */
    private CourseResponse mapToCourseResponse(Course course) {
        return new CourseResponse(
                course.getCourseId(),
                course.getCourseCode(),
                course.getCourseName(),
                course.getDescription(),
                course.getCredits(),
                course.getPrerequisites(),
                course.getDepartment(),
                course.getSemester(),
                course.getCapacity()
        );
    }
}
