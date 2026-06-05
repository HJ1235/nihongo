package com.nihongo.backend.correction.generator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihongo.backend.correction.config.AiCorrectionProperties;
import com.nihongo.backend.domain.correction.CorrectionMode;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

public class GeminiCorrectionGenerator implements CorrectionGenerator {

    private final AiCorrectionProperties properties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public GeminiCorrectionGenerator(AiCorrectionProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(properties.getGeminiBaseUrl())
                .build();
    }

    @Override
    public CorrectionResult generate(String originalText, CorrectionMode mode) {
        CorrectionMode safeMode = mode == null ? CorrectionMode.GENERAL : mode;
        Map<String, Object> request = Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", CorrectionPromptFactory.systemPrompt(safeMode)))
                ),
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", CorrectionPromptFactory.userPrompt(originalText, safeMode)))
                )),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "responseSchema", correctionResultSchema()
                )
        );

        JsonNode response = restClient.post()
                .uri("/models/{model}:generateContent?key={apiKey}", properties.getGeminiModel(), properties.getGeminiApiKey())
                .body(request)
                .retrieve()
                .body(JsonNode.class);

        return parseCorrectionResult(extractText(response));
    }

    private Map<String, Object> correctionResultSchema() {
        return Map.of(
                "type", "object",
                "properties", Map.of(
                        "correctedText", Map.of("type", "string"),
                        "explanation", Map.of("type", "string")
                ),
                "required", List.of("correctedText", "explanation")
        );
    }

    private String extractText(JsonNode response) {
        JsonNode text = response == null
                ? null
                : response.path("candidates").path(0).path("content").path("parts").path(0).path("text");
        if (text != null && text.isTextual() && !text.asText().isBlank()) {
            return text.asText();
        }

        throw new IllegalStateException("Gemini correction response did not contain text.");
    }

    private CorrectionResult parseCorrectionResult(String jsonText) {
        try {
            JsonNode result = objectMapper.readTree(jsonText);
            return new CorrectionResult(
                    result.path("correctedText").asText(),
                    result.path("explanation").asText()
            );
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse Gemini correction response.", e);
        }
    }
}
