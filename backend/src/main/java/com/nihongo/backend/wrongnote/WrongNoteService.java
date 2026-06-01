package com.nihongo.backend.wrongnote;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import com.nihongo.backend.domain.wrongnote.WrongNote;
import com.nihongo.backend.domain.wrongnote.WrongNoteRepository;
import com.nihongo.backend.wrongnote.dto.WrongNoteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WrongNoteService {

    private final WrongNoteRepository wrongNoteRepository;
    private final UserRepository userRepository;
    private final KanaLessonRepository kanaLessonRepository;

    @Transactional
    public void recordWrong(Long userId, Long lessonId) {
        wrongNoteRepository.findByUserIdAndLessonId(userId, lessonId)
                .ifPresentOrElse(
                        WrongNote::increaseWrongCount,
                        () -> {
                            WrongNote wrongNote = createWrongNote(userId, lessonId);
                            wrongNote.increaseWrongCount();
                            wrongNoteRepository.save(wrongNote);
                        }
                );
    }

    @Transactional(readOnly = true)
    public List<WrongNoteResponse> getWrongNotes(Long userId) {
        return wrongNoteRepository.findByUserIdOrderByLastWrongAtDesc(userId).stream()
                .map(WrongNoteResponse::from)
                .toList();
    }

    @Transactional
    public void deleteWrongNote(Long userId, Long lessonId) {
        WrongNote wrongNote = wrongNoteRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Wrong note not found."));

        wrongNoteRepository.delete(wrongNote);
    }

    @Transactional
    public boolean resolveWrongNoteIfExists(Long userId, Long lessonId) {
        return wrongNoteRepository.findByUserIdAndLessonId(userId, lessonId)
                .map(wrongNote -> {
                    wrongNoteRepository.delete(wrongNote);
                    return true;
                })
                .orElse(false);
    }

    private WrongNote createWrongNote(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        KanaLesson lesson = kanaLessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found."));

        return WrongNote.builder()
                .user(user)
                .lesson(lesson)
                .wrongCount(0)
                .build();
    }
}
