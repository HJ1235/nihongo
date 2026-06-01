package com.nihongo.backend.word.dto;

import com.nihongo.backend.domain.word.WordLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class WordQuizQuestionResponse {

    private Long wordId;
    private WordLevel level;
    private String japanese;
    private String reading;
    private List<String> choices;
}
