package com.myus.service;

import com.myus.dto.SurveyDto;
import com.myus.dto.SurveyResponseRequest;

import java.util.List;

public interface EvaluationService {
    List<SurveyDto> getSurveysForStudent(String username);
    SurveyDto getSurveyById(String username, Long surveyId);
    SurveyDto submitSurvey(String username, Long surveyId, SurveyResponseRequest request);
}
