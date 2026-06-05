package com.nihongo.backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUserCount;
    private long activeUserCount;
    private long suspendedUserCount;
    private long noticeCount;
    private long pinnedNoticeCount;
    private long totalCorrectionCount;
    private long todayCorrectionCount;
}
