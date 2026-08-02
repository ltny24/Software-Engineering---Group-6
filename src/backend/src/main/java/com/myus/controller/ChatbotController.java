package com.myus.controller;

import com.myus.dto.ai.*;
import com.myus.entity.Student;
import com.myus.service.ai.ChatbotService;
import com.myus.service.ai.CourseRecommendationService;
import com.myus.service.ai.GraduationTrackingService;
import com.myus.service.ai.ProfileAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for AI Learning Path Chatbot.
 *
 * <p>All endpoints require JWT authentication with STUDENT role.</p>
 */
@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
@Slf4j
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final CourseRecommendationService courseRecommendationService;
    private final GraduationTrackingService graduationTrackingService;
    private final ProfileAnalysisService profileAnalysisService;

    /**
     * Process a natural-language chat message.
     */
    @PostMapping("/chat")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ChatResponseDTO> chat(
            @AuthenticationPrincipal Student student,
            @RequestBody ChatRequestDTO request) {
        log.info("POST /api/v1/chatbot/chat — student={}", student.getUsername());
        ChatResponseDTO response = chatbotService.processChat(student, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get recommended courses for the next semester.
     */
    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseSuggestionDTO>> getRecommendations(
            @AuthenticationPrincipal Student student) {
        log.info("GET /api/v1/chatbot/recommendations — student={}", student.getUsername());
        List<CourseSuggestionDTO> recommendations = courseRecommendationService.recommendCourses(student);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get degree audit and graduation projection.
     */
    @GetMapping("/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GraduationProgressDTO> getProgress(
            @AuthenticationPrincipal Student student,
            @RequestParam(defaultValue = "15") int creditsPerTerm) {
        log.info("GET /api/v1/chatbot/progress — student={}, creditsPerTerm={}",
                student.getUsername(), creditsPerTerm);
        GraduationProgressDTO progress = graduationTrackingService.projectGraduation(student, creditsPerTerm);
        return ResponseEntity.ok(progress);
    }
}
