package com.nihongo.backend.correction.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihongo.backend.correction.generator.CorrectionGenerator;
import com.nihongo.backend.correction.generator.FallbackCorrectionGenerator;
import com.nihongo.backend.correction.generator.GeminiCorrectionGenerator;
import com.nihongo.backend.correction.generator.MockCorrectionGenerator;
import com.nihongo.backend.correction.generator.OpenAiCorrectionGenerator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
@EnableConfigurationProperties(AiCorrectionProperties.class)
public class AiCorrectionConfig {

    @Bean
    @ConditionalOnMissingBean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    @Primary
    public CorrectionGenerator correctionGenerator(
            AiCorrectionProperties properties,
            ObjectMapper objectMapper,
            MockCorrectionGenerator mockCorrectionGenerator
    ) {
        String provider = properties.getProvider() == null ? "mock" : properties.getProvider().trim().toLowerCase();

        return switch (provider) {
            case "openai" -> properties.hasOpenaiApiKey()
                    ? new FallbackCorrectionGenerator(
                            new OpenAiCorrectionGenerator(properties, objectMapper),
                            mockCorrectionGenerator
                    )
                    : mockCorrectionGenerator;
            case "gemini" -> properties.hasGeminiApiKey()
                    ? new FallbackCorrectionGenerator(
                            new GeminiCorrectionGenerator(properties, objectMapper),
                            mockCorrectionGenerator
                    )
                    : mockCorrectionGenerator;
            default -> mockCorrectionGenerator;
        };
    }
}
