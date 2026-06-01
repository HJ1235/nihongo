package com.nihongo.backend.quiz;

import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.quiz.dto.QuizAnswerRequest;
import com.nihongo.backend.quiz.dto.QuizAnswerResponse;
import com.nihongo.backend.quiz.dto.QuizQuestionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/random")
    public ApiResponse<QuizQuestionResponse> getRandomQuestion() {
        return ApiResponse.success(quizService.getRandomQuestion());
    }

    @GetMapping("/review/random")
    public ApiResponse<QuizQuestionResponse> getRandomReviewQuestion(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(quizService.getRandomReviewQuestion(userId));
    }

    @PostMapping("/answer")
    public ApiResponse<QuizAnswerResponse> answer(Authentication authentication, @Valid @RequestBody QuizAnswerRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(quizService.answer(userId, request));
    }
}
