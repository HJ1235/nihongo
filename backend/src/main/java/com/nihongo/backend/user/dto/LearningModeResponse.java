package com.nihongo.backend.user.dto;

import com.nihongo.backend.domain.user.type.LearningMode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LearningModeResponse {

    private LearningMode learningMode;
}
