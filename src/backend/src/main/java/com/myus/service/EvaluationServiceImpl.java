package com.myus.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myus.dto.SurveyDto;
import com.myus.dto.SurveyResponseRequest;
import com.myus.entity.Student;
import com.myus.entity.Survey;
import com.myus.entity.SurveyResponse;
import com.myus.exception.EvaluationException;
import com.myus.exception.ResourceNotFoundException;
import com.myus.repository.StudentRepository;
import com.myus.repository.SurveyRepository;
import com.myus.repository.SurveyResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final SurveyRepository surveyRepository;
    private final SurveyResponseRepository surveyResponseRepository;
    private final StudentRepository studentRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SurveyDto> getSurveysForStudent(String username) {
        // Exclude drafts
        List<Survey> surveys = surveyRepository.findByStatusNot("Draft");

        return surveys.stream().map(survey -> mapToDto(survey, username)).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SurveyDto getSurveyById(String username, Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey not found"));
        return mapToDto(survey, username);
    }

    @Override
    @Transactional
    public SurveyDto submitSurvey(String username, Long surveyId, SurveyResponseRequest request) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

        if (!"Published".equals(survey.getStatus()) && !"Open".equals(survey.getStatus())) {
            throw new EvaluationException("Survey is not open for responses");
        }
        
        if (survey.getCloseDate() != null && LocalDateTime.now().isAfter(survey.getCloseDate())) {
            throw new EvaluationException("Survey deadline has passed");
        }

        Optional<SurveyResponse> existingResponse = surveyResponseRepository.findBySurvey_SurveyIdAndStudent_Username(surveyId, username);
        if (existingResponse.isPresent()) {
            throw new EvaluationException("You have already completed this survey");
        }

        try {
            String answersJson = objectMapper.writeValueAsString(request);
            
            SurveyResponse response = new SurveyResponse();
            response.setSurvey(survey);
            response.setStudent(student);
            response.setSubmittedAt(LocalDateTime.now());
            response.setAnswers(answersJson);
            
            surveyResponseRepository.save(response);
            
            return mapToDto(survey, username);
            
        } catch (JsonProcessingException e) {
            throw new EvaluationException("Error processing survey responses");
        }
    }

    private SurveyDto mapToDto(Survey survey, String username) {
        Optional<SurveyResponse> existingResponse = surveyResponseRepository.findBySurvey_SurveyIdAndStudent_Username(survey.getSurveyId(), username);
        
        String status = "Pending";
        String answers = null;
        LocalDateTime submittedAt = null;
        
        if (existingResponse.isPresent()) {
            status = "Completed";
            answers = existingResponse.get().getAnswers();
            submittedAt = existingResponse.get().getSubmittedAt();
        } else if (survey.getCloseDate() != null && LocalDateTime.now().isAfter(survey.getCloseDate())) {
            status = "Closed";
        }

        return SurveyDto.builder()
                .surveyId(survey.getSurveyId())
                .title(survey.getTitle())
                .description(survey.getDescription())
                .openDate(survey.getOpenDate())
                .closeDate(survey.getCloseDate())
                .status(status)
                .submittedAnswers(answers)
                .submittedAt(submittedAt)
                .build();
    }
}
