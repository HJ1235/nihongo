package com.nihongo.backend.correction.dto;

import com.nihongo.backend.domain.correction.Correction;
import com.nihongo.backend.domain.correction.CorrectionMode;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CorrectionResponse {

    private Long id;
    private Long userId;
    private String originalText;
    private String correctedText;
    private String explanation;
    private CorrectionMode mode;
    private LocalDateTime createdAt;

    public static CorrectionResponse from(Correction correction) {
        return new CorrectionResponse(
                correction.getId(),
                correction.getUser().getId(),
                correction.getOriginalText(),
                correction.getCorrectedText(),
                correction.getExplanation(),
                correction.getMode(),
                correction.getCreatedAt()
        );
    }
}
