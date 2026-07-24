package com.myus.infrastructure.config;

import com.myus.domain.model.Student;
import com.myus.domain.model.UserRole;
import com.myus.domain.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Hardcoded data initializer for demo purposes.
 *
 * <p>Inserts a demo student account if it does not already exist.
 * Activated in all profiles by default; restrict to specific profiles
 * with {@code @Profile("demo")} if needed.</p>
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(StudentRepository studentRepository,
                           PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedDemoStudent();
    }

    /**
     * Insert a hardcoded demo student for easy login during demos.
     *
     * <p>Credentials:
     * <ul>
     *   <li>Username: <b>demo</b></li>
     *   <li>Password: <b>010106</b></li>
     * </ul>
     * </p>
     */
    private void seedDemoStudent() {
        String demoUsername = "demo";

        if (studentRepository.findByUsername(demoUsername).isPresent()) {
            log.info("Demo student '{}' already exists — skipping.", demoUsername);
            return;
        }

        Student demo = new Student();
        demo.setUsername(demoUsername);
        demo.setPassword(passwordEncoder.encode("010106"));
        demo.setRole(UserRole.STUDENT);
        demo.setFirstName("Demo");
        demo.setLastName("Student");
        demo.setEmail("demo@student.hcmus.edu.vn");
        demo.setPhone("0901234567");
        demo.setAddress("227 Nguyễn Văn Cừ, Quận 5, TP.HCM");
        demo.setDateOfBirth(LocalDate.of(2005, 6, 15));
        demo.setStudentType("Chính quy Đại trà");
        demo.setMajor("Kỹ thuật phần mềm");
        demo.setEnrollmentStatus("Enrolled");
        demo.setRegistrationStatus("Active");
        demo.setCreatedAt(LocalDateTime.now());

        studentRepository.save(demo);
        log.info("============================================");
        log.info(" Demo student inserted successfully!");
        log.info("   Username: demo");
        log.info("   Password: 010106");
        log.info("============================================");
    }
}