package com.nihongo.backend.lesson;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.lesson.KanaType;
import com.nihongo.backend.lesson.dto.LessonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final KanaLessonRepository kanaLessonRepository;

    @Transactional(readOnly = true)
    public List<LessonResponse> getLessons(KanaType type) {
        List<KanaLesson> lessons = type == null
                ? kanaLessonRepository.findAllByOrderByIdAsc()
                : kanaLessonRepository.findByTypeOrderByIdAsc(type);

        return lessons.stream()
                .map(LessonResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonResponse getLesson(Long lessonId) {
        KanaLesson lesson = kanaLessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학습입니다."));

        return LessonResponse.from(lesson);
    }
}
