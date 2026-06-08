package com.nihongo.backend.domain.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KanaLessonRepository extends JpaRepository<KanaLesson, Long> {

    List<KanaLesson> findAllByOrderByIdAsc();

    List<KanaLesson> findByTypeOrderByIdAsc(KanaType type);

    boolean existsByTypeAndKana(KanaType type, String kana);

    long countByType(KanaType type);

    @Query(value = """
            select count(*)
            from (
                select distinct type, kana
                from kana_lessons
                where type in ('HIRAGANA', 'KATAKANA')
            ) distinct_kana_lessons
            """, nativeQuery = true)
    long countDistinctTypeAndKana();

    @Query("""
            select c.type, c.kana, count(c)
            from KanaLesson c
            group by c.type, c.kana
            having count(c) > 1
            order by c.type, c.kana
            """)
    List<Object[]> findDuplicateTypeAndKanaRows();

    @Query(value = """
            select distinct type
            from kana_lessons
            where type not in ('HIRAGANA', 'KATAKANA')
            """, nativeQuery = true)
    List<String> findUnknownTypes();
}
