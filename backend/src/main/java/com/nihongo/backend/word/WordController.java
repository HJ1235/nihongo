package com.nihongo.backend.word;

import com.nihongo.backend.domain.word.WordLevel;
import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.word.dto.WordQuizAnswerRequest;
import com.nihongo.backend.word.dto.WordQuizAnswerResponse;
import com.nihongo.backend.word.dto.WordQuizQuestionResponse;
import com.nihongo.backend.word.dto.WordResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @GetMapping("/api/words")
    public ApiResponse<List<WordResponse>> getWords(@RequestParam(required = false) WordLevel level) {
        return ApiResponse.success(wordService.getWords(level));
    }

    @GetMapping("/api/word-quiz/random")
    public ApiResponse<WordQuizQuestionResponse> getRandomWordQuiz(@RequestParam(required = false) WordLevel level) {
        return ApiResponse.success(wordService.getRandomQuestion(level));
    }

    @PostMapping("/api/word-quiz/answer")
    public ApiResponse<WordQuizAnswerResponse> answerWordQuiz(@Valid @RequestBody WordQuizAnswerRequest request) {
        return ApiResponse.success(wordService.answer(request));
    }
}
