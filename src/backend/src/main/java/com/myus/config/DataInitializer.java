package com.myus.config;

import com.myus.entity.Administrator;
import com.myus.entity.Student;
import com.myus.repository.AdministratorRepository;
import com.myus.repository.StudentRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * On first startup, checks whether stored passwords are already BCrypt-encoded.
 * If they are stored in plaintext (e.g. from mock data), this runner
 * re-encodes them with the configured {@link PasswordEncoder}.
 *
 * <p>This only runs when the {@code dev} profile is active, and is safe to
 * run repeatedly — already-encoded passwords (starting with {@code $2a$})
 * are skipped.</p>
 */
@Slf4j
@Component
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(StudentRepository studentRepository,
                           AdministratorRepository administratorRepository,
                           PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.administratorRepository = administratorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking stored passwords for BCrypt encoding and default credentials...");
        encodeStudentPasswords();
        encodeAdminPasswords();
        log.info("Password encoding check complete.");
    }

    private void encodeStudentPasswords() {
        List<Student> students = studentRepository.findAll();
        int updated = 0;
        for (Student student : students) {
            String defaultRawPassword = student.getUsername() + "123";
            if (!isValidPassword(student.getPassword(), defaultRawPassword)) {
                student.setPassword(passwordEncoder.encode(defaultRawPassword));
                updated++;
            }
        }
        if (updated > 0) {
            studentRepository.saveAll(students);
            log.info("✓ BCrypt-encoded {} student passwords to default (username+123)", updated);
        } else {
            log.info("✓ All {} student passwords are valid BCrypt-encoded hashes", students.size());
        }
    }

    private void encodeAdminPasswords() {
        List<Administrator> admins = administratorRepository.findAll();
        int updated = 0;
        for (Administrator admin : admins) {
            String defaultRawPassword = admin.getUsername();
            if (!isValidPassword(admin.getPassword(), defaultRawPassword)) {
                admin.setPassword(passwordEncoder.encode(defaultRawPassword));
                updated++;
            }
        }
        if (updated > 0) {
            administratorRepository.saveAll(admins);
            log.info("✓ BCrypt-encoded {} administrator passwords to default (username)", updated);
        } else {
            log.info("✓ All {} administrator passwords are valid BCrypt-encoded hashes", admins.size());
        }
    }

    /**
     * Checks if the stored password is a valid BCrypt hash matching the expected default raw password.
     */
    private boolean isValidPassword(String storedPassword, String expectedRawPassword) {
        if (storedPassword == null || !storedPassword.startsWith("$2")) {
            return false;
        }
        try {
            return passwordEncoder.matches(expectedRawPassword, storedPassword);
        } catch (Exception e) {
            return false;
        }
    }
}
