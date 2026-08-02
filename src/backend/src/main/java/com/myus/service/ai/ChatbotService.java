package com.myus.service.ai;

import com.myus.dto.ai.ChatRequestDTO;
import com.myus.dto.ai.ChatResponseDTO;
import com.myus.entity.Student;

/**
 * Service interface for AI chatbot operations combining rule-based
 * degree audit with Gemini LLM conversational responses.
 */
public interface ChatbotService {

    /**
     * Process a chat message and return an AI-generated response.
     *
     * @param student the authenticated student
     * @param request the chat request containing message and context type
     * @return structured chat response with optional recommendations or progress data
     */
    ChatResponseDTO processChat(Student student, ChatRequestDTO request);
}
