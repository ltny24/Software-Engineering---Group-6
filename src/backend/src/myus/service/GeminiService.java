package myus.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Service for calling Google Gemini REST API.
 *
 * <p>Sends structured prompts to Gemini and returns the generated text.
 * If the API key is not configured or the call fails, returns {@code null}
 * so the caller can fall back to rule-based responses.</p>
 */
@Slf4j
@Service
public class GeminiService {

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final String apiKey;
    private final String model;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService(
            @Value("${app.gemini.api-key:}") String apiKey,
            @Value("${app.gemini.model:gemini-2.0-flash}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Gemini API key not configured – chatbot will use rule-based fallback.");
        } else {
            log.info("Gemini API configured with model: {}", model);
        }
    }

    /**
     * Check if Gemini API is available (API key is configured).
     */
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Send a message to Gemini with a system instruction and return the response text.
     *
     * @param systemPrompt the system instruction to set context
     * @param userMessage  the user's message
     * @return the generated text, or {@code null} if the call fails
     */
    public String chat(String systemPrompt, String userMessage) {
        if (!isAvailable()) {
            return null;
        }

        try {
            String url = String.format(GEMINI_URL, model, apiKey);

            // Build request body per Gemini API spec
            ObjectNode requestBody = objectMapper.createObjectNode();

            // System instruction
            ObjectNode systemInstruction = objectMapper.createObjectNode();
            ObjectNode systemPart = objectMapper.createObjectNode();
            systemPart.put("text", systemPrompt);
            ArrayNode systemParts = objectMapper.createArrayNode();
            systemParts.add(systemPart);
            systemInstruction.set("parts", systemParts);
            requestBody.set("system_instruction", systemInstruction);

            // User message content
            ObjectNode userContent = objectMapper.createObjectNode();
            userContent.put("role", "user");
            ObjectNode userPart = objectMapper.createObjectNode();
            userPart.put("text", userMessage);
            ArrayNode userParts = objectMapper.createArrayNode();
            userParts.add(userPart);
            userContent.set("parts", userParts);
            ArrayNode contents = objectMapper.createArrayNode();
            contents.add(userContent);
            requestBody.set("contents", contents);

            // Generation config
            ObjectNode generationConfig = objectMapper.createObjectNode();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 1024);
            requestBody.set("generationConfig", generationConfig);

            // Send request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(
                    objectMapper.writeValueAsString(requestBody), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode text = candidates.get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .path("text");
                    String result = text.asText();
                    log.debug("Gemini response received ({} chars)", result.length());
                    return result;
                }
            }

            log.warn("Gemini returned unexpected response: {}", response.getStatusCode());
            return null;

        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return null;
        }
    }
}
