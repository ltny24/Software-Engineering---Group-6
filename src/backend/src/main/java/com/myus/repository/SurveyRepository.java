package com.myus.repository;

import com.myus.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    
    // For this prototype, we'll just fetch all published surveys 
    // In a real app, this might join with CourseOffering depending on targetAudience
    List<Survey> findByStatusNot(String status);
}
