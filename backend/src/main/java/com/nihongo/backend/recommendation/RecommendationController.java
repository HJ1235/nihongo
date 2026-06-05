package com.nihongo.backend.recommendation;

import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.recommendation.dto.ModeRecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ApiResponse<ModeRecommendationResponse> getRecommendations(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(recommendationService.getRecommendations(userId));
    }
}
