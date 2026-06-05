package com.nihongo.backend.recommendation;

import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import com.nihongo.backend.domain.user.type.LearningMode;
import com.nihongo.backend.recommendation.dto.ModeRecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final Map<LearningMode, List<String>> MODE_RECOMMENDATIONS = Map.of(
            LearningMode.JAPAN_JOB,
            List.of("면접 자기소개 연습", "경어 표현 학습", "비즈니스 메일 작성", "전화 응대 표현", "이력서/직무경력서 표현", "회사 생활 표현"),
            LearningMode.WORKING_HOLIDAY,
            List.of("편의점 알바 표현", "음식점 주문/응대", "집 구하기 표현", "병원 방문 표현", "구약소(区役所) 전입신고", "주민표(住民票) 발급", "국민건강보험 가입", "마이넘버 관련 표현"),
            LearningMode.DAILY_LIFE,
            List.of("카페 주문", "길 묻기", "쇼핑", "약속 잡기", "택배 수령", "은행 계좌 개설", "휴대폰 개통", "구약소 민원 처리"),
            LearningMode.JLPT,
            List.of("N5 기초 문법", "N4 동사 활용", "N3 독해", "N2/N1 어휘", "청해 연습", "독해 문제 풀이"),
            LearningMode.GENERAL,
            List.of("히라가나 복습", "가타카나 복습", "기본 인사", "기초 문장 만들기")
    );

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ModeRecommendationResponse getRecommendations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        LearningMode learningMode = user.getLearningMode() == null ? LearningMode.GENERAL : user.getLearningMode();

        return new ModeRecommendationResponse(
                learningMode,
                MODE_RECOMMENDATIONS.getOrDefault(learningMode, MODE_RECOMMENDATIONS.get(LearningMode.GENERAL))
        );
    }
}
