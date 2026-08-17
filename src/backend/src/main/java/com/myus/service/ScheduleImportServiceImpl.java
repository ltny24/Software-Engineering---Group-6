package com.myus.service;

import com.myus.dto.ScheduleImportRequest;
import com.myus.dto.ScheduleImportResponse;
import com.myus.dto.SchedulePreviewResponse;
import com.myus.dto.ScheduleRow;
import com.myus.dto.ScheduleRowIssue;
import com.myus.entity.Course;
import com.myus.entity.CourseOffering;
import com.myus.exception.ScheduleImportException;
import com.myus.repository.CourseOfferingRepository;
import com.myus.repository.CourseRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Default implementation of {@link ScheduleImportService}.
 *
 * <p>Reads a CSV file whose header must contain the columns
 * {@code courseCode, section, term, schedule, instructor, location, room},
 * validates each row (required fields + course-code resolution), and imports
 * the approved rows into {@link CourseOffering}.</p>
 */
@Slf4j
@Service
public class ScheduleImportServiceImpl implements ScheduleImportService {

    private static final List<String> REQUIRED_COLUMNS = Arrays.asList(
            "courseCode", "section", "term", "schedule");

    private static final List<String> OPTIONAL_COLUMNS = Arrays.asList(
            "instructor", "location", "room");

    private final CourseRepository courseRepository;
    private final CourseOfferingRepository offeringRepository;

    public ScheduleImportServiceImpl(CourseRepository courseRepository,
                                     CourseOfferingRepository offeringRepository) {
        this.courseRepository = courseRepository;
        this.offeringRepository = offeringRepository;
    }

    @Override
    public SchedulePreviewResponse preview(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ScheduleImportException("Uploaded file is empty.");
        }

        List<ScheduleRow> parsedRows;
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)) {
            parsedRows = parseRows(reader);
        } catch (IOException e) {
            log.warn("Failed to read uploaded schedule CSV: {}", e.getMessage());
            throw new ScheduleImportException("Could not read the uploaded file. Please upload a valid CSV.");
        }

        SchedulePreviewResponse response = new SchedulePreviewResponse();
        response.setTotalRows(parsedRows.size());

        for (int i = 0; i < parsedRows.size(); i++) {
            ScheduleRow row = parsedRows.get(i);
            List<String> errors = validateRow(row);

            if (errors.isEmpty()) {
                response.getValidRows().add(row);
            } else {
                ScheduleRowIssue issue = toIssue(i + 1, row, errors);
                response.getInvalidRows().add(issue);
            }
        }

        response.setValidCount(response.getValidRows().size());
        response.setInvalidCount(response.getInvalidRows().size());
        return response;
    }

    @Override
    @Transactional
    public ScheduleImportResponse importOfferings(ScheduleImportRequest request) {
        ScheduleImportResponse response = new ScheduleImportResponse();

        if (request == null || request.getRows() == null || request.getRows().isEmpty()) {
            return response;
        }

        for (ScheduleRow row : request.getRows()) {
            List<String> errors = validateRow(row);
            if (!errors.isEmpty()) {
                response.setSkipped(response.getSkipped() + 1);
                response.getMessages().add(
                        row.getCourseCode() + " / " + row.getSection() + ": " + String.join("; ", errors));
                continue;
            }

            Course course = courseRepository.findByCourseCode(row.getCourseCode().trim())
                    .orElse(null);
            if (course == null) {
                response.setSkipped(response.getSkipped() + 1);
                response.getMessages().add("Unknown course code: " + row.getCourseCode());
                continue;
            }

            CourseOffering offering = new CourseOffering();
            offering.setCourse(course);
            offering.setSection(trimToNull(row.getSection()));
            offering.setTerm(trimToNull(row.getTerm()));
            offering.setSchedule(trimToNull(row.getSchedule()));
            offering.setInstructor(trimToNull(row.getInstructor()));
            offering.setLocation(trimToNull(row.getLocation()));
            offering.setRoom(trimToNull(row.getRoom()));

            offeringRepository.save(offering);
            response.setAdded(response.getAdded() + 1);
        }

        return response;
    }

    // ── Parsing & validation helpers ───────────────────────────

    /**
     * Parses CSV rows into {@link ScheduleRow} objects using the header row.
     * Throws {@link ScheduleImportException} if any required column is missing.
     */
    private List<ScheduleRow> parseRows(Reader reader) throws IOException {
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreEmptyLines(true)
                .setTrim(true)
                .build();

        List<ScheduleRow> rows = new ArrayList<>();
        try (CSVParser parser = format.parse(reader)) {
            Map<String, Integer> headerMap = parser.getHeaderMap();
            for (String required : REQUIRED_COLUMNS) {
                if (!containsHeader(headerMap, required)) {
                    throw new ScheduleImportException(
                            "Missing required column: " + required + ". Expected columns: "
                                    + String.join(", ", REQUIRED_COLUMNS) + ", "
                                    + String.join(", ", OPTIONAL_COLUMNS));
                }
            }

            for (CSVRecord record : parser) {
                ScheduleRow row = new ScheduleRow();
                row.setCourseCode(value(record, headerMap, "courseCode"));
                row.setSection(value(record, headerMap, "section"));
                row.setTerm(value(record, headerMap, "term"));
                row.setSchedule(value(record, headerMap, "schedule"));
                row.setInstructor(value(record, headerMap, "instructor"));
                row.setLocation(value(record, headerMap, "location"));
                row.setRoom(value(record, headerMap, "room"));
                rows.add(row);
            }
        }
        return rows;
    }

    /**
     * Validates a single row: required fields present and course code resolvable.
     */
    private List<String> validateRow(ScheduleRow row) {
        List<String> errors = new ArrayList<>();

        if (isBlank(row.getCourseCode())) {
            errors.add("courseCode is required");
        } else if (courseRepository.findByCourseCode(row.getCourseCode().trim()).isEmpty()) {
            errors.add("Unknown course code: " + row.getCourseCode().trim());
        }

        if (isBlank(row.getSection())) {
            errors.add("section is required");
        }
        if (isBlank(row.getTerm())) {
            errors.add("term is required");
        }
        if (isBlank(row.getSchedule())) {
            errors.add("schedule is required");
        }

        return errors;
    }

    private ScheduleRowIssue toIssue(int rowNumber, ScheduleRow row, List<String> errors) {
        ScheduleRowIssue issue = new ScheduleRowIssue();
        issue.setRowNumber(rowNumber);
        issue.setCourseCode(row.getCourseCode());
        issue.setSection(row.getSection());
        issue.setTerm(row.getTerm());
        issue.setSchedule(row.getSchedule());
        issue.setInstructor(row.getInstructor());
        issue.setLocation(row.getLocation());
        issue.setRoom(row.getRoom());
        issue.setErrors(errors);
        return issue;
    }

    private boolean containsHeader(Map<String, Integer> headerMap, String name) {
        return headerMap.keySet().stream()
                .anyMatch(h -> h.equalsIgnoreCase(name));
    }

    private String value(CSVRecord record, Map<String, Integer> headerMap, String name) {
        Integer index = headerMap.entrySet().stream()
                .filter(e -> e.getKey().equalsIgnoreCase(name))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
        if (index == null || index >= record.size()) {
            return null;
        }
        return record.get(index);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String trimToNull(String s) {
        if (s == null) {
            return null;
        }
        String trimmed = s.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
