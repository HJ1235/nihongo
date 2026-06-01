package com.nihongo.backend.lesson;

import com.nihongo.backend.domain.lesson.KanaType;
import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.lesson.dto.LessonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    public ApiResponse<List<LessonResponse>> getLessons(@RequestParam(required = false) KanaType type) {
        return ApiResponse.success(lessonService.getLessons(type));
    }

    @GetMapping("/{lessonId}")
    public ApiResponse<LessonResponse> getLesson(@PathVariable Long lessonId) {
        return ApiResponse.success(lessonService.getLesson(lessonId));
    }
}
