package com.myus.repository;
import com.myus.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    java.util.List<CourseRegistration> findByStudentStudentId(Long id);
    long countActiveByOfferingId(Long offeringId);
    
    java.util.Optional<CourseRegistration> findActiveByStudentAndOffering(Long studentId, Long offeringId);
    
    java.util.List<CourseRegistration> findByStudentIdWithOfferingAndCourse(Long studentId);
}

