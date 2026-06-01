package com.nihongo.backend.word.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WordQuizAnswerRequest {

    @NotNull(message = "wordId는 필수입니다.")
    @Positive(message = "wordId는 양수여야 합니다.")
    private Long wordId;

    @NotBlank(message = "answer는 필수입니다.")
    private String answer;
}
