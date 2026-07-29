package com.myus.config;

import com.myus.entity.Student;
import com.myus.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Profile;

import java.util.List;

/**
 * Converts existing student passwords stored as plain text to BCrypt once.
 * Login itself never accepts a plain-text stored password.
 */
@Component
@Profile("!test")
public class StudentPasswordMigration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(StudentPasswordMigration.class);

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentPasswordMigration(StudentRepository studentRepository,
                                    PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<Student> studentsToMigrate = studentRepository.findAll().stream()
                .filter(student -> !isBcryptHash(student.getPassword()))
                .toList();

        studentsToMigrate.forEach(student ->
                student.setPassword(passwordEncoder.encode(student.getPassword())));

        if (!studentsToMigrate.isEmpty()) {
            studentRepository.saveAll(studentsToMigrate);
            log.info("Migrated {} student password(s) to BCrypt.", studentsToMigrate.size());
        }
    }

    private boolean isBcryptHash(String password) {
        return password != null && password.matches("^\\$2[aby]\\$.+");
    }
}
