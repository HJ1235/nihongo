package com.nihongo.backend.recommendation.dto;

import com.nihongo.backend.domain.user.type.LearningMode;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ModeRecommendationResponse {

    private LearningMode learningMode;
    private List<String> recommendations;
}
