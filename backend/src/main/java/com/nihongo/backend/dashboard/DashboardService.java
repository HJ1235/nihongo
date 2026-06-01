package com.nihongo.backend.dashboard;

import com.nihongo.backend.dashboard.dto.DashboardResponse;
import com.nihongo.backend.dashboard.dto.RecentLessonResponse;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.lesson.KanaType;
import com.nihongo.backend.domain.progress.UserLessonProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final KanaLessonRepository kanaLessonRepository;
    private final UserLessonProgressRepository progressRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        long totalLessons = kanaLessonRepository.count();
        long completedLessons = progressRepository.countByUserIdAndCompletedTrue(userId);
        double progressPercent = calculateProgressPercent(completedLessons, totalLessons);
        long hiraganaCompleted = progressRepository.countByUserIdAndLessonTypeAndCompletedTrue(userId, KanaType.HIRAGANA);
        long katakanaCompleted = progressRepository.countByUserIdAndLessonTypeAndCompletedTrue(userId, KanaType.KATAKANA);
        List<RecentLessonResponse> recentCompletedLessons = progressRepository
                .findTop5ByUserIdAndCompletedTrueOrderByCompletedAtDesc(userId)
                .stream()
                .map(RecentLessonResponse::from)
                .toList();

        return new DashboardResponse(
                totalLessons,
                completedLessons,
                progressPercent,
                hiraganaCompleted,
                katakanaCompleted,
                recentCompletedLessons
        );
    }

    private double calculateProgressPercent(long completedLessons, long totalLessons) {
        if (totalLessons == 0) {
            return 0.0;
        }

        double percent = (double) completedLessons / totalLessons * 100;
        return Math.round(percent * 10) / 10.0;
    }
}
