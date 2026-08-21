package com.myus.service;

import com.myus.dto.CourseImportIssue;
import com.myus.dto.CourseImportPreviewResponse;
import com.myus.dto.CourseImportRequest;
import com.myus.dto.CourseImportResponse;
import com.myus.dto.CourseImportRow;
import com.myus.dto.StudentImportIssue;
import com.myus.dto.StudentImportPreviewResponse;
import com.myus.dto.StudentImportRequest;
import com.myus.dto.StudentImportResponse;
import com.myus.dto.StudentImportRow;
import com.myus.entity.AuditLog;
import com.myus.entity.Course;
import com.myus.entity.Student;
import com.myus.entity.UserRole;
import com.myus.exception.BulkImportException;
import com.myus.repository.AuditLogRepository;
import com.myus.repository.CourseRepository;
import com.myus.repository.StudentRepository;
import com.myus.util.ImportFileReader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Default implementation of {@link BulkImportService}.
 *
 * <p>Reads CSV/XLSX files describing student or course records, validates each
 * row (required fields, formats, and file-internal duplicates), and imports the
 * approved rows. Course imports upsert by {@code courseCode}; student imports
 * can overwrite existing records when {@code updateExisting} is set. Every
 * confirmed import is recorded in the {@link AuditLog}.</p>
 */
@Slf4j
@Service
public class BulkImportServiceImpl implements BulkImportService {

    private static final List<String> STUDENT_REQUIRED = Arrays.asList(
            "username", "password", "firstName", "lastName", "email");
    private static final List<String> STUDENT_OPTIONAL = Arrays.asList(
            "middleName", "phone", "address", "dateOfBirth", "studentType",
            "major", "enrollmentStatus", "registrationStatus");

    private static final List<String> COURSE_REQUIRED = Arrays.asList("courseCode", "courseName");
    private static final List<String> COURSE_OPTIONAL = Arrays.asList(
            "description", "credits", "prerequisites", "department", "semester", "capacity");

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private static final int MIN_PASSWORD_LENGTH = 6;

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public BulkImportServiceImpl(StudentRepository studentRepository,
                                 CourseRepository courseRepository,
                                 AuditLogRepository auditLogRepository,
                                 PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ── Students ───────────────────────────────────────────────

    @Override
    public StudentImportPreviewResponse previewStudents(MultipartFile file) {
        ImportFileReader.ParsedFile parsed = read(file, STUDENT_REQUIRED, STUDENT_OPTIONAL);
        Map<String, String> headerIndex = indexHeaders(parsed.headers());

        StudentImportPreviewResponse response = new StudentImportPreviewResponse();
        response.setTotalRows(parsed.rows().size());

        Set<String> seenUsernames = new HashSet<>();
        Set<String> seenEmails = new HashSet<>();

        for (int i = 0; i < parsed.rows().size(); i++) {
            StudentImportRow row = toStudentRow(parsed.rows().get(i), headerIndex);
            List<String> errors = validateStudentRow(row, seenUsernames, seenEmails);

            if (errors.isEmpty()) {
                response.getValidRows().add(row);
            } else {
                response.getInvalidRows().add(toStudentIssue(i + 1, row, errors));
            }
        }

        response.setValidCount(response.getValidRows().size());
        response.setInvalidCount(response.getInvalidRows().size());
        return response;
    }

    @Override
    @Transactional
    public StudentImportResponse importStudents(StudentImportRequest request, String adminUsername) {
        StudentImportResponse response = new StudentImportResponse();

        if (request == null || request.getRows() == null || request.getRows().isEmpty()) {
            return response;
        }

        Set<String> seenUsernames = new HashSet<>();
        Set<String> seenEmails = new HashSet<>();

        for (StudentImportRow row : request.getRows()) {
            List<String> errors = validateStudentRow(row, seenUsernames, seenEmails);
            if (!errors.isEmpty()) {
                response.setSkipped(response.getSkipped() + 1);
                response.getMessages().add(
                        (row.getUsername() != null ? row.getUsername() : "(missing username)")
                                + ": " + String.join("; ", errors));
                continue;
            }

            Student existing = studentRepository.findByUsername(row.getUsername().trim())
                    .orElseGet(() -> studentRepository.findByEmail(row.getEmail().trim()).orElse(null));

            if (existing != null) {
                if (request.isUpdateExisting()) {
                    applyStudent(existing, row);
                    studentRepository.save(existing);
                    response.setUpdated(response.getUpdated() + 1);
                } else {
                    response.setSkipped(response.getSkipped() + 1);
                    response.getMessages().add(row.getUsername().trim() + ": already exists (skipped)");
                }
                continue;
            }

            Student student = new Student();
            applyStudent(student, row);
            student.setRole(UserRole.STUDENT);
            student.setCreatedAt(LocalDateTime.now());
            studentRepository.save(student);
            response.setAdded(response.getAdded() + 1);
        }

        writeAuditLog(adminUsername, "BULK_IMPORT", "Student",
                "added=" + response.getAdded() + ", updated=" + response.getUpdated()
                        + ", skipped=" + response.getSkipped());
        return response;
    }

    // ── Courses ────────────────────────────────────────────────

    @Override
    public CourseImportPreviewResponse previewCourses(MultipartFile file) {
        ImportFileReader.ParsedFile parsed = read(file, COURSE_REQUIRED, COURSE_OPTIONAL);
        Map<String, String> headerIndex = indexHeaders(parsed.headers());

        CourseImportPreviewResponse response = new CourseImportPreviewResponse();
        response.setTotalRows(parsed.rows().size());

        Set<String> seenCodes = new HashSet<>();

        for (int i = 0; i < parsed.rows().size(); i++) {
            CourseImportRow row = toCourseRow(parsed.rows().get(i), headerIndex);
            List<String> errors = validateCourseRow(row, seenCodes);

            if (errors.isEmpty()) {
                response.getValidRows().add(row);
            } else {
                response.getInvalidRows().add(toCourseIssue(i + 1, row, errors));
            }
        }

        response.setValidCount(response.getValidRows().size());
        response.setInvalidCount(response.getInvalidRows().size());
        return response;
    }

    @Override
    @Transactional
    public CourseImportResponse importCourses(CourseImportRequest request, String adminUsername) {
        CourseImportResponse response = new CourseImportResponse();

        if (request == null || request.getRows() == null || request.getRows().isEmpty()) {
            return response;
        }

        Set<String> seenCodes = new HashSet<>();

        for (CourseImportRow row : request.getRows()) {
            List<String> errors = validateCourseRow(row, seenCodes);
            if (!errors.isEmpty()) {
                response.setSkipped(response.getSkipped() + 1);
                response.getMessages().add(
                        (row.getCourseCode() != null ? row.getCourseCode() : "(missing code)")
                                + ": " + String.join("; ", errors));
                continue;
            }

            Course existing = courseRepository.findByCourseCode(row.getCourseCode().trim())
                    .orElse(null);
            if (existing != null) {
                applyCourse(existing, row);
                courseRepository.save(existing);
                response.setUpdated(response.getUpdated() + 1);
            } else {
                Course course = new Course();
                applyCourse(course, row);
                courseRepository.save(course);
                response.setAdded(response.getAdded() + 1);
            }
        }

        writeAuditLog(adminUsername, "BULK_IMPORT", "Course",
                "added=" + response.getAdded() + ", updated=" + response.getUpdated()
                        + ", skipped=" + response.getSkipped());
        return response;
    }

    // ── Parsing & validation helpers ───────────────────────────

    private ImportFileReader.ParsedFile read(MultipartFile file,
                                             List<String> required,
                                             List<String> optional) {
        if (file == null || file.isEmpty()) {
            throw new BulkImportException("Uploaded file is empty.");
        }
        ImportFileReader.ParsedFile parsed;
        try {
            parsed = ImportFileReader.read(file);
        } catch (IOException e) {
            log.warn("Failed to read uploaded import file: {}", e.getMessage());
            throw new BulkImportException("Could not read the uploaded file. Please upload a valid CSV or XLSX.");
        }

        Map<String, String> headerIndex = indexHeaders(parsed.headers());
        for (String col : required) {
            if (!headerIndex.containsKey(col.toLowerCase())) {
                throw new BulkImportException(
                        "Missing required column: " + col + ". Expected columns: "
                                + String.join(", ", required) + ", " + String.join(", ", optional));
            }
        }
        return parsed;
    }

    private Map<String, String> indexHeaders(List<String> headers) {
        Map<String, String> index = new LinkedHashMap<>();
        for (String header : headers) {
            if (header != null && !header.isBlank()) {
                index.put(header.trim().toLowerCase(), header.trim());
            }
        }
        return index;
    }

    private String value(Map<String, String> row, Map<String, String> headerIndex, String name) {
        String actual = headerIndex.get(name.toLowerCase());
        return actual == null ? null : row.get(actual);
    }

    private StudentImportRow toStudentRow(Map<String, String> row, Map<String, String> headerIndex) {
        StudentImportRow r = new StudentImportRow();
        r.setUsername(value(row, headerIndex, "username"));
        r.setPassword(value(row, headerIndex, "password"));
        r.setFirstName(value(row, headerIndex, "firstName"));
        r.setMiddleName(value(row, headerIndex, "middleName"));
        r.setLastName(value(row, headerIndex, "lastName"));
        r.setEmail(value(row, headerIndex, "email"));
        r.setPhone(value(row, headerIndex, "phone"));
        r.setAddress(value(row, headerIndex, "address"));
        r.setDateOfBirth(value(row, headerIndex, "dateOfBirth"));
        r.setStudentType(value(row, headerIndex, "studentType"));
        r.setMajor(value(row, headerIndex, "major"));
        r.setEnrollmentStatus(value(row, headerIndex, "enrollmentStatus"));
        r.setRegistrationStatus(value(row, headerIndex, "registrationStatus"));
        return r;
    }

    private CourseImportRow toCourseRow(Map<String, String> row, Map<String, String> headerIndex) {
        CourseImportRow r = new CourseImportRow();
        r.setCourseCode(value(row, headerIndex, "courseCode"));
        r.setCourseName(value(row, headerIndex, "courseName"));
        r.setDescription(value(row, headerIndex, "description"));
        r.setCredits(value(row, headerIndex, "credits"));
        r.setPrerequisites(value(row, headerIndex, "prerequisites"));
        r.setDepartment(value(row, headerIndex, "department"));
        r.setSemester(value(row, headerIndex, "semester"));
        r.setCapacity(value(row, headerIndex, "capacity"));
        return r;
    }

    private List<String> validateStudentRow(StudentImportRow row,
                                            Set<String> seenUsernames,
                                            Set<String> seenEmails) {
        List<String> errors = new ArrayList<>();

        String username = trimToNull(row.getUsername());
        String email = trimToNull(row.getEmail());

        if (username == null) {
            errors.add("username: required");
        } else if (!seenUsernames.add(username.toLowerCase())) {
            errors.add("username: duplicate in file");
        }

        if (isBlank(row.getPassword())) {
            errors.add("password: required");
        } else if (row.getPassword().length() < MIN_PASSWORD_LENGTH) {
            errors.add("password: must be at least " + MIN_PASSWORD_LENGTH + " characters");
        }

        if (isBlank(row.getFirstName())) {
            errors.add("firstName: required");
        }
        if (isBlank(row.getLastName())) {
            errors.add("lastName: required");
        }

        if (email == null) {
            errors.add("email: required");
        } else if (!EMAIL_PATTERN.matcher(email).matches()) {
            errors.add("email: invalid format");
        } else if (!seenEmails.add(email.toLowerCase())) {
            errors.add("email: duplicate in file");
        }

        if (!isBlank(row.getDateOfBirth())) {
            try {
                LocalDate.parse(row.getDateOfBirth().trim());
            } catch (DateTimeParseException e) {
                errors.add("dateOfBirth: invalid format (expected yyyy-MM-dd)");
            }
        }

        return errors;
    }

    private List<String> validateCourseRow(CourseImportRow row, Set<String> seenCodes) {
        List<String> errors = new ArrayList<>();

        String code = trimToNull(row.getCourseCode());
        if (code == null) {
            errors.add("courseCode: required");
        } else if (!seenCodes.add(code.toLowerCase())) {
            errors.add("courseCode: duplicate in file");
        }

        if (isBlank(row.getCourseName())) {
            errors.add("courseName: required");
        }

        if (!isBlank(row.getCredits()) && !isInteger(row.getCredits())) {
            errors.add("credits: must be an integer");
        }
        if (!isBlank(row.getCapacity()) && !isInteger(row.getCapacity())) {
            errors.add("capacity: must be an integer");
        }

        return errors;
    }

    private void applyStudent(Student student, StudentImportRow row) {
        student.setUsername(row.getUsername().trim());
        student.setPassword(passwordEncoder.encode(row.getPassword()));
        student.setFirstName(row.getFirstName().trim());
        student.setMiddleName(trimToNull(row.getMiddleName()));
        student.setLastName(row.getLastName().trim());
        student.setEmail(row.getEmail().trim());
        student.setPhone(trimToNull(row.getPhone()));
        student.setAddress(trimToNull(row.getAddress()));
        student.setDateOfBirth(parseDate(row.getDateOfBirth()));
        student.setStudentType(trimToNull(row.getStudentType()));
        student.setMajor(trimToNull(row.getMajor()));
        student.setEnrollmentStatus(trimToNull(row.getEnrollmentStatus()));
        student.setRegistrationStatus(trimToNull(row.getRegistrationStatus()));
        student.setUpdatedAt(LocalDateTime.now());
    }

    private void applyCourse(Course course, CourseImportRow row) {
        course.setCourseCode(row.getCourseCode().trim());
        course.setCourseName(row.getCourseName().trim());
        course.setDescription(trimToNull(row.getDescription()));
        course.setCredits(parseInteger(row.getCredits()));
        course.setPrerequisites(trimToNull(row.getPrerequisites()));
        course.setDepartment(trimToNull(row.getDepartment()));
        course.setSemester(trimToNull(row.getSemester()));
        course.setCapacity(parseInteger(row.getCapacity()));
    }

    private StudentImportIssue toStudentIssue(int rowNumber, StudentImportRow row, List<String> errors) {
        StudentImportIssue issue = new StudentImportIssue();
        issue.setRowNumber(rowNumber);
        issue.setUsername(row.getUsername());
        issue.setFirstName(row.getFirstName());
        issue.setLastName(row.getLastName());
        issue.setEmail(row.getEmail());
        issue.setErrors(errors);
        return issue;
    }

    private CourseImportIssue toCourseIssue(int rowNumber, CourseImportRow row, List<String> errors) {
        CourseImportIssue issue = new CourseImportIssue();
        issue.setRowNumber(rowNumber);
        issue.setCourseCode(row.getCourseCode());
        issue.setCourseName(row.getCourseName());
        issue.setErrors(errors);
        return issue;
    }

    private void writeAuditLog(String adminUsername, String actionType, String targetEntity, String details) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAdminUsername(adminUsername);
        auditLog.setActionType(actionType);
        auditLog.setTargetEntity(targetEntity);
        auditLog.setTargetEntityId("-");
        auditLog.setDetails(details);
        auditLogRepository.save(auditLog);
    }

    // ── Small parsing utilities ────────────────────────────────

    private LocalDate parseDate(String value) {
        if (isBlank(value)) {
            return null;
        }
        return LocalDate.parse(value.trim());
    }

    private Integer parseInteger(String value) {
        if (isBlank(value)) {
            return null;
        }
        return Integer.parseInt(value.trim());
    }

    private boolean isInteger(String value) {
        try {
            Integer.parseInt(value.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
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
