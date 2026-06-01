package com.nihongo.backend.domain.progress;

import com.nihongo.backend.domain.lesson.KanaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {

    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserLessonProgress> findByUserIdOrderByLessonIdAsc(Long userId);

    long countByUserIdAndCompletedTrue(Long userId);

    long countByUserIdAndLessonTypeAndCompletedTrue(Long userId, KanaType type);

    List<UserLessonProgress> findTop5ByUserIdAndCompletedTrueOrderByCompletedAtDesc(Long userId);
}
