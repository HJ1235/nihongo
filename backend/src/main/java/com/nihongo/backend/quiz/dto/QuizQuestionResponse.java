package com.nihongo.backend.quiz.dto;

import com.nihongo.backend.domain.lesson.KanaType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class QuizQuestionResponse {

    private Long lessonId;
    private KanaType kanaType;
    private String character;
    private List<String> choices;
}
