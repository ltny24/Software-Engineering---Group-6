package com.myus.config;

import com.myus.entity.Administrator;
import com.myus.entity.Student;
import com.myus.repository.AdministratorRepository;
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
 * Converts existing student and administrator passwords stored as plain text to BCrypt once.
 * Login itself never accepts a plain-text stored password.
 */
@Component
@Profile("!test")
public class StudentPasswordMigration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(StudentPasswordMigration.class);

    private final StudentRepository studentRepository;
    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentPasswordMigration(StudentRepository studentRepository,
                                    AdministratorRepository administratorRepository,
                                    PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.administratorRepository = administratorRepository;
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

        List<Administrator> adminsToMigrate = administratorRepository.findAll().stream()
                .filter(admin -> !isBcryptHash(admin.getPassword()))
                .toList();

        adminsToMigrate.forEach(admin ->
                admin.setPassword(passwordEncoder.encode(admin.getPassword())));

        if (!adminsToMigrate.isEmpty()) {
            administratorRepository.saveAll(adminsToMigrate);
            log.info("Migrated {} administrator password(s) to BCrypt.", adminsToMigrate.size());
        }
    }

    private boolean isBcryptHash(String password) {
        return password != null && password.matches("^\\$2[aby]\\$.+");
    }
}
