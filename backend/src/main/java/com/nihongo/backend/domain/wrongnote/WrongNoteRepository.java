package com.nihongo.backend.domain.wrongnote;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WrongNoteRepository extends JpaRepository<WrongNote, Long> {

    Optional<WrongNote> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<WrongNote> findByUserIdOrderByLastWrongAtDesc(Long userId);
}
