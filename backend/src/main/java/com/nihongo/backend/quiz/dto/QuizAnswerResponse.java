package com.nihongo.backend.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuizAnswerResponse {

    private boolean correct;
    private String correctAnswer;
    private boolean progressCompleted;
    private boolean wrongNoteResolved;
}
