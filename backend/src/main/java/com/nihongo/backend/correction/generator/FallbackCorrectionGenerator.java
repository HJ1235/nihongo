package com.nihongo.backend.correction.generator;

import com.nihongo.backend.domain.correction.CorrectionMode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FallbackCorrectionGenerator implements CorrectionGenerator {

    private static final Logger log = LoggerFactory.getLogger(FallbackCorrectionGenerator.class);

    private final CorrectionGenerator primary;
    private final CorrectionGenerator fallback;

    public FallbackCorrectionGenerator(CorrectionGenerator primary, CorrectionGenerator fallback) {
        this.primary = primary;
        this.fallback = fallback;
    }

    @Override
    public CorrectionResult generate(String originalText, CorrectionMode mode) {
        try {
            return primary.generate(originalText, mode);
        } catch (RuntimeException e) {
            log.warn("AI correction failed. Falling back to mock correction.", e);
            return fallback.generate(originalText, mode);
        }
    }
}
