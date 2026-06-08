package com.nihongo.backend.correction.generator;

import com.nihongo.backend.domain.correction.CorrectionMode;

public final class CorrectionPromptFactory {

    private CorrectionPromptFactory() {
    }

    public static String systemPrompt(CorrectionMode mode) {
        return """
                You are a Japanese correction assistant for Korean-speaking Japanese learners.
                Return only valid JSON with correctedText and explanation.
                correctedText must be natural Japanese only.
                explanation must be written in Korean for Korean-speaking users.
                The main explanation text must be Korean. You may include short Japanese examples in quotes when needed.
                Do not write the explanation mainly in Japanese.
                Do not put Korean explanation inside correctedText.
                Never create incorrect Japanese.
                Never append です after a verb that already ends with ます, ました, or ません.
                """.stripIndent()
                + "\nMode guidance: " + modeGuidance(mode);
    }

    public static String userPrompt(String originalText, CorrectionMode mode) {
        return """
                Correction mode: %s
                Original text:
                %s

                Output rules:
                - Keep the user's original Japanese meaning.
                - correctedText: corrected natural Japanese.
                - explanation: Korean explanation only, with Japanese examples allowed when useful.
                """.formatted(mode.name(), originalText);
    }

    private static String modeGuidance(CorrectionMode mode) {
        return switch (mode) {
            case JOB_INTERVIEW -> "Use polite Japanese suitable for job interviews and Japanese workplace communication.";
            case WORKING_HOLIDAY -> "Use natural Japanese for working holiday, city office, part-time job, housing, hospital, and daily administration situations.";
            case DAILY_LIFE -> "Use natural Japanese for daily life conversations.";
            case GENERAL -> "Use natural general Japanese expressions.";
        };
    }
}
