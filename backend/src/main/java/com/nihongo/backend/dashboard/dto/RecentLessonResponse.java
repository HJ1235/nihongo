package com.nihongo.backend.dashboard.dto;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.progress.UserLessonProgress;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RecentLessonResponse {

    private Long lessonId;
    private String character;
    private String romaji;
    private LocalDateTime completedAt;

    public static RecentLessonResponse from(UserLessonProgress progress) {
        KanaLesson lesson = progress.getLesson();

        return new RecentLessonResponse(
                lesson.getId(),
                lesson.getKana(),
                lesson.getRomaji(),
                progress.getCompletedAt()
        );
    }
}
