package com.myus.config.ai;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for Google Gemini API integration.
 * Properties are read from {@code application.properties} prefixed with {@code app.ai.gemini}.
 */
@Configuration
public class AiConfig {

    @Bean
    @ConfigurationProperties(prefix = "app.ai.gemini")
    public GeminiProperties geminiProperties() {
        return new GeminiProperties();
    }

    @Bean
    public WebClient geminiWebClient(GeminiProperties props) {
        return WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Data
    public static class GeminiProperties {
        private String apiKey;
        private String model = "gemini-2.0-flash";
        private String baseUrl = "https://generativelanguage.googleapis.com/v1beta";
        private int timeoutSeconds = 30;
        private int maxTokens = 1024;
        private double temperature = 0.7;
    }
}
