package com.nihongo.backend.correction.generator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihongo.backend.correction.config.AiCorrectionProperties;
import com.nihongo.backend.domain.correction.CorrectionMode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class OpenAiCorrectionGenerator implements CorrectionGenerator {

    private static final Logger log = LoggerFactory.getLogger(OpenAiCorrectionGenerator.class);

    private final AiCorrectionProperties properties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public OpenAiCorrectionGenerator(AiCorrectionProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(properties.getOpenaiBaseUrl())
                .defaultHeader("Authorization", "Bearer " + properties.getOpenaiApiKey())
                .build();
    }

    @Override
    public CorrectionResult generate(String originalText, CorrectionMode mode) {
        CorrectionMode safeMode = mode == null ? CorrectionMode.GENERAL : mode;
        Map<String, Object> request = Map.of(
                "model", properties.getOpenaiModel(),
                "input", List.of(
                        Map.of(
                                "role", "system",
                                "content", List.of(Map.of("type", "input_text", "text", CorrectionPromptFactory.systemPrompt(safeMode)))
                        ),
                        Map.of(
                                "role", "user",
                                "content", List.of(Map.of("type", "input_text", "text", CorrectionPromptFactory.userPrompt(originalText, safeMode)))
                        )
                ),
                "text", Map.of(
                        "format", Map.of(
                                "type", "json_schema",
                                "name", "correction_result",
                                "strict", true,
                                "schema", correctionResultSchema()
                        )
                )
        );

        JsonNode response = restClient.post()
                .uri("/responses")
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (requestSpec, clientResponse) -> {
                    String body = new String(clientResponse.getBody().readAllBytes(), StandardCharsets.UTF_8);
                    log.warn("OpenAI API error. status={}, body={}", clientResponse.getStatusCode(), body);
                    throw new IllegalStateException("OpenAI API error: " + clientResponse.getStatusCode() + " " + body);
                })
                .body(JsonNode.class);

        return parseCorrectionResult(extractText(response));
    }

    private Map<String, Object> correctionResultSchema() {
        return Map.of(
                "type", "object",
                "additionalProperties", false,
                "properties", Map.of(
                        "correctedText", Map.of("type", "string"),
                        "explanation", Map.of("type", "string")
                ),
                "required", List.of("correctedText", "explanation")
        );
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            throw new IllegalStateException("OpenAI correction response is empty.");
        }

        JsonNode outputText = response.path("output_text");
        if (outputText.isTextual() && !outputText.asText().isBlank()) {
            return outputText.asText();
        }

        for (JsonNode output : response.path("output")) {
            for (JsonNode content : output.path("content")) {
                if ("output_text".equals(content.path("type").asText()) && content.path("text").isTextual()) {
                    return content.path("text").asText();
                }
            }
        }

        log.warn("OpenAI correction response did not contain output text. response={}", response);
        throw new IllegalStateException("OpenAI correction response did not contain output text.");
    }

    private CorrectionResult parseCorrectionResult(String jsonText) {
        try {
            JsonNode result = objectMapper.readTree(jsonText);
            return new CorrectionResult(
                    result.path("correctedText").asText(),
                    result.path("explanation").asText()
            );
        } catch (Exception e) {
            log.warn("Failed to parse OpenAI correction response. text={}", jsonText);
            throw new IllegalStateException("Failed to parse OpenAI correction response.", e);
        }
    }
}
