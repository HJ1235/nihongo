package com.nihongo.backend.correction.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai.correction")
public class AiCorrectionProperties {

    private String provider = "mock";
    private String openaiApiKey = "";
    private String openaiModel = "gpt-5.2";
    private String openaiBaseUrl = "https://api.openai.com/v1";
    private String geminiApiKey = "";
    private String geminiModel = "gemini-2.5-flash";
    private String geminiBaseUrl = "https://generativelanguage.googleapis.com/v1beta";

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getOpenaiApiKey() {
        return openaiApiKey;
    }

    public void setOpenaiApiKey(String openaiApiKey) {
        this.openaiApiKey = openaiApiKey;
    }

    public String getOpenaiModel() {
        return openaiModel;
    }

    public void setOpenaiModel(String openaiModel) {
        this.openaiModel = openaiModel;
    }

    public String getOpenaiBaseUrl() {
        return openaiBaseUrl;
    }

    public void setOpenaiBaseUrl(String openaiBaseUrl) {
        this.openaiBaseUrl = openaiBaseUrl;
    }

    public String getGeminiApiKey() {
        return geminiApiKey;
    }

    public void setGeminiApiKey(String geminiApiKey) {
        this.geminiApiKey = geminiApiKey;
    }

    public String getGeminiModel() {
        return geminiModel;
    }

    public void setGeminiModel(String geminiModel) {
        this.geminiModel = geminiModel;
    }

    public String getGeminiBaseUrl() {
        return geminiBaseUrl;
    }

    public void setGeminiBaseUrl(String geminiBaseUrl) {
        this.geminiBaseUrl = geminiBaseUrl;
    }

    public boolean hasOpenaiApiKey() {
        return hasText(openaiApiKey);
    }

    public boolean hasGeminiApiKey() {
        return hasText(geminiApiKey);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
