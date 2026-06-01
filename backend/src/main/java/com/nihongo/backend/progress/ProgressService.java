package com.nihongo.backend.progress;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.progress.UserLessonProgress;
import com.nihongo.backend.domain.progress.UserLessonProgressRepository;
import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import com.nihongo.backend.progress.dto.ProgressCompleteRequest;
import com.nihongo.backend.progress.dto.ProgressResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserLessonProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final KanaLessonRepository kanaLessonRepository;

    @Transactional
    public ProgressResponse complete(Long userId, ProgressCompleteRequest request) {
        return complete(userId, request.getLessonId());
    }

    @Transactional
    public ProgressResponse complete(Long userId, Long lessonId) {
        if (lessonId == null) {
            throw new IllegalArgumentException("lessonId is required.");
        }

        UserLessonProgress progress = progressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> saveCompletedProgress(userId, lessonId));

        return ProgressResponse.from(progress);
    }

    @Transactional(readOnly = true)
    public List<ProgressResponse> getProgress(Long userId) {
        return progressRepository.findByUserIdOrderByLessonIdAsc(userId).stream()
                .map(ProgressResponse::from)
                .toList();
    }

    private UserLessonProgress saveCompletedProgress(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        KanaLesson lesson = kanaLessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found."));

        UserLessonProgress progress = UserLessonProgress.builder()
                .user(user)
                .lesson(lesson)
                .completed(true)
                .wrongCount(0)
                .build();

        return progressRepository.save(progress);
    }
}
