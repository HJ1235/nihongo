package com.nihongo.backend.lesson.dto;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LessonResponse {

    private Long id;
    private KanaType kanaType;
    private String character;
    private String romaji;
    private String meaning;

    public static LessonResponse from(KanaLesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                lesson.getType(),
                lesson.getKana(),
                lesson.getRomaji(),
                lesson.getKana()
        );
    }
}
