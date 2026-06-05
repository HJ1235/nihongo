package com.nihongo.backend.correction.generator;

public record CorrectionResult(
        String correctedText,
        String explanation
) {
}
