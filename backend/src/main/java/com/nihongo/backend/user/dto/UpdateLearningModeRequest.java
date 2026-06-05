package com.nihongo.backend.user.dto;

import com.nihongo.backend.domain.user.type.LearningMode;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateLearningModeRequest {

    @NotNull(message = "Learning mode is required.")
    private LearningMode learningMode;
}
