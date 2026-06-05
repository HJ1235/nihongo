package com.nihongo.backend.correction.generator;

import com.nihongo.backend.domain.correction.CorrectionMode;
import org.springframework.stereotype.Component;

@Component
public class MockCorrectionGenerator implements CorrectionGenerator {

    @Override
    public CorrectionResult generate(String originalText, CorrectionMode mode) {
        String normalizedText = normalize(originalText);
        CorrectionMode safeMode = mode == null ? CorrectionMode.GENERAL : mode;

        String correctedText = switch (safeMode) {
            case JOB_INTERVIEW -> toPoliteSentence(normalizedText)
                    + " 面接では、より丁寧で落ち着いた表現にすると自然です。";
            case WORKING_HOLIDAY -> toPoliteSentence(normalizedText)
                    + " ワーキングホリデーの場面では、目的が伝わる短い表現が使いやすいです。";
            case DAILY_LIFE -> toCasualPoliteSentence(normalizedText);
            case GENERAL -> toPoliteSentence(normalizedText);
        };

        String explanation = switch (safeMode) {
            case JOB_INTERVIEW -> "면접 상황에 맞게 문장을 공손한 형태로 정리했습니다. 실제 AI 연동 전 Mock 교정 결과입니다.";
            case WORKING_HOLIDAY -> "워킹홀리데이 상황에서 의도가 분명하게 전달되도록 자연스러운 표현으로 다듬었습니다. 실제 AI 연동 전 Mock 교정 결과입니다.";
            case DAILY_LIFE -> "일상 대화에서 어색하지 않도록 부드러운 표현으로 정리했습니다. 실제 AI 연동 전 Mock 교정 결과입니다.";
            case GENERAL -> "기본 문장 흐름과 문장 부호를 정리했습니다. 실제 AI 연동 전 Mock 교정 결과입니다.";
        };

        return new CorrectionResult(correctedText, explanation);
    }

    private String normalize(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private String toPoliteSentence(String text) {
        String sentence = removeTrailingPunctuation(text);
        if (sentence.endsWith("です") || sentence.endsWith("ます")) {
            return sentence + "。";
        }

        return sentence + "です。";
    }

    private String toCasualPoliteSentence(String text) {
        String sentence = removeTrailingPunctuation(text);
        return sentence + "。";
    }

    private String removeTrailingPunctuation(String text) {
        return text.replaceAll("[。.!！?？]+$", "");
    }
}
