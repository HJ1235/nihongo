package com.nihongo.backend.correction.generator;

import com.nihongo.backend.domain.correction.CorrectionMode;
import org.springframework.stereotype.Component;

@Component
public class MockCorrectionGenerator implements CorrectionGenerator {

    private static final String MOCK_SUFFIX = " 실제 AI 연동 전 Mock 교정 결과입니다.";

    @Override
    public CorrectionResult generate(String originalText, CorrectionMode mode) {
        String normalizedText = normalize(originalText);
        CorrectionMode safeMode = mode == null ? CorrectionMode.GENERAL : mode;

        if (safeMode == CorrectionMode.WORKING_HOLIDAY && isMovingInNotificationSentence(normalizedText)) {
            return new CorrectionResult(
                    "札幌に引っ越してきたので、転入届の手続きに来ました。",
                    "워킹홀리데이 상황에서는 구약소 창구에서 목적이 자연스럽게 전달되도록 「転入届の手続きに来ました」처럼 말하는 것이 좋습니다."
                            + MOCK_SUFFIX
            );
        }

        String correctedText = switch (safeMode) {
            case JOB_INTERVIEW -> toPoliteSentence(normalizedText)
                    + " 面接では、より丁寧で簡潔な表現を意識すると自然です。";
            case WORKING_HOLIDAY -> toPoliteSentence(normalizedText)
                    + " ワーキングホリデーの場面では、目的と必要な手続きが伝わる表現にすると自然です。";
            case DAILY_LIFE -> toCasualPoliteSentence(normalizedText);
            case GENERAL -> toPoliteSentence(normalizedText);
        };

        String explanation = switch (safeMode) {
            case JOB_INTERVIEW -> "면접 상황에 맞게 문장을 공손한 형태로 정리했습니다." + MOCK_SUFFIX;
            case WORKING_HOLIDAY -> "워킹홀리데이 상황에서 의도가 분명하게 전달되도록 자연스러운 표현으로 다듬었습니다." + MOCK_SUFFIX;
            case DAILY_LIFE -> "일상 대화에서 어색하지 않도록 부드러운 표현으로 정리했습니다." + MOCK_SUFFIX;
            case GENERAL -> "기본 문장 흐름과 문장 부호를 정리했습니다." + MOCK_SUFFIX;
        };

        return new CorrectionResult(correctedText, explanation);
    }

    private String normalize(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private boolean isMovingInNotificationSentence(String text) {
        return text.contains("引っ越して") && text.contains("転入届");
    }

    private String toPoliteSentence(String text) {
        String sentence = removeTrailingPunctuation(text);
        if (endsWithPoliteForm(sentence)) {
            return sentence + "。";
        }

        return sentence + "です。";
    }

    private boolean endsWithPoliteForm(String sentence) {
        return sentence.endsWith("です")
                || sentence.endsWith("ます")
                || sentence.endsWith("ました")
                || sentence.endsWith("ません");
    }

    private String toCasualPoliteSentence(String text) {
        String sentence = removeTrailingPunctuation(text);
        if (sentence.isBlank()) {
            return "ありがとうございます。";
        }

        return sentence + "。";
    }

    private String removeTrailingPunctuation(String text) {
        return text.replaceAll("[。.!！?？]+$", "");
    }
}
