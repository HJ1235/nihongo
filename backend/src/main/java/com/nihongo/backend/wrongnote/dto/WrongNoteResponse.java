package com.nihongo.backend.wrongnote.dto;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaType;
import com.nihongo.backend.domain.wrongnote.WrongNote;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class WrongNoteResponse {

    private Long lessonId;
    private KanaType kanaType;
    private String character;
    private String romaji;
    private int wrongCount;
    private LocalDateTime lastWrongAt;

    public static WrongNoteResponse from(WrongNote wrongNote) {
        KanaLesson lesson = wrongNote.getLesson();

        return new WrongNoteResponse(
                lesson.getId(),
                lesson.getType(),
                lesson.getKana(),
                lesson.getRomaji(),
                wrongNote.getWrongCount(),
                wrongNote.getLastWrongAt()
        );
    }
}
