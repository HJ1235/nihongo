package com.nihongo.backend.correction.dto;

import com.nihongo.backend.domain.correction.CorrectionMode;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CorrectionStatsResponse {

    private long totalCount;
    private long generalCount;
    private long jobInterviewCount;
    private long workingHolidayCount;
    private long dailyLifeCount;
    private LocalDateTime latestCorrectedAt;
    private CorrectionMode mostUsedMode;
}
