package com.nihongo.backend.correction.generator;

import com.nihongo.backend.domain.correction.CorrectionMode;

public interface CorrectionGenerator {

    CorrectionResult generate(String originalText, CorrectionMode mode);
}
