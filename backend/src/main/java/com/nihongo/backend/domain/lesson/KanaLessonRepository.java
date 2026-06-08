package com.nihongo.backend.domain.lesson;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KanaLessonRepository extends JpaRepository<KanaLesson, Long> {

    List<KanaLesson> findAllByOrderByIdAsc();

    List<KanaLesson> findByTypeOrderByIdAsc(KanaType type);

    boolean existsByTypeAndKana(KanaType type, String kana);
}
