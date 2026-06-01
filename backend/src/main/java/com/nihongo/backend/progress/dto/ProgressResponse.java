package com.nihongo.backend.progress.dto;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaType;
import com.nihongo.backend.domain.progress.UserLessonProgress;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProgressResponse {

    private Long lessonId;
    private KanaType kanaType;
    private String character;
    private String romaji;
    private LocalDateTime completedAt;

    public static ProgressResponse from(UserLessonProgress progress) {
        KanaLesson lesson = progress.getLesson();

        return new ProgressResponse(
                lesson.getId(),
                lesson.getType(),
                lesson.getKana(),
                lesson.getRomaji(),
                progress.getCompletedAt()
        );
    }
}
