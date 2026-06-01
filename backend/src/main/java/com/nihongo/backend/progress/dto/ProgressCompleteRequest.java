package com.nihongo.backend.progress.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProgressCompleteRequest {

    @NotNull(message = "lessonId는 필수입니다.")
    @Positive(message = "lessonId는 양수여야 합니다.")
    private Long lessonId;
}
