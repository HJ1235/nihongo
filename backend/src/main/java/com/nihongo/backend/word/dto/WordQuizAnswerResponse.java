package com.nihongo.backend.word.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WordQuizAnswerResponse {

    private boolean correct;
    private String correctAnswer;
}
