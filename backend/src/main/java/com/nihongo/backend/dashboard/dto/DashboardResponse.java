package com.nihongo.backend.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private long totalLessons;
    private long completedLessons;
    private double progressPercent;
    private long hiraganaCompleted;
    private long katakanaCompleted;
    private List<RecentLessonResponse> recentCompletedLessons;
}
