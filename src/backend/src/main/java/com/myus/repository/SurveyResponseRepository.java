package com.myus.repository;

import com.myus.entity.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    
    Optional<SurveyResponse> findBySurvey_SurveyIdAndStudent_Username(Long surveyId, String username);
}
