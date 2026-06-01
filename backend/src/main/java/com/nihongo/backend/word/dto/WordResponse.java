package com.nihongo.backend.word.dto;

import com.nihongo.backend.domain.word.Word;
import com.nihongo.backend.domain.word.WordLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WordResponse {

    private Long id;
    private WordLevel level;
    private String japanese;
    private String reading;
    private String meaning;
    private String exampleSentence;
    private String exampleMeaning;

    public static WordResponse from(Word word) {
        return new WordResponse(
                word.getId(),
                word.getLevel(),
                word.getJapanese(),
                word.getReading(),
                word.getMeaning(),
                word.getExampleSentence(),
                word.getExampleMeaning()
        );
    }
}
