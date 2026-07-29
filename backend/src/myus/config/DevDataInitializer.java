package myus.config;

import myus.entity.Administrator;
import myus.entity.Student;
import myus.entity.UserRole;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
public class DevDataInitializer implements CommandLineRunner {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public void run(String... args) {
        Administrator admin = new Administrator();
        admin.setUsername("admin");
        admin.setPassword("admin");
        admin.setRole(UserRole.ADMINISTRATOR);
        admin.setEmail("admin@myus.edu.vn");
        admin.setDisplayName("Admin User");
        admin.setDepartment("Academic Affairs");
        em.persist(admin);

        Student student = new Student();
        student.setUsername("student");
        student.setPassword("student");
        student.setRole(UserRole.STUDENT);
        student.setFirstName("Test");
        student.setLastName("User");
        student.setEmail("student@myus.edu.vn");
        student.setStudentType("Regular");
        student.setMajor("Software Engineering");
        student.setEnrollmentStatus("Enrolled");
        student.setRegistrationStatus("Active");
        em.persist(student);
    }
}
