package com.nihongo.backend.quiz;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.wrongnote.WrongNote;
import com.nihongo.backend.domain.wrongnote.WrongNoteRepository;
import com.nihongo.backend.quiz.dto.QuizAnswerRequest;
import com.nihongo.backend.quiz.dto.QuizAnswerResponse;
import com.nihongo.backend.quiz.dto.QuizQuestionResponse;
import com.nihongo.backend.progress.ProgressService;
import com.nihongo.backend.wrongnote.WrongNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class QuizService {

    private static final int CHOICE_COUNT = 4;

    private final KanaLessonRepository kanaLessonRepository;
    private final WrongNoteRepository wrongNoteRepository;
    private final ProgressService progressService;
    private final WrongNoteService wrongNoteService;

    @Transactional(readOnly = true)
    public QuizQuestionResponse getRandomQuestion() {
        List<KanaLesson> lessons = kanaLessonRepository.findAll();
        if (lessons.isEmpty()) {
            throw new IllegalArgumentException("Lesson data is empty.");
        }

        KanaLesson question = lessons.get(ThreadLocalRandom.current().nextInt(lessons.size()));
        return createQuestionResponse(question, lessons);
    }

    @Transactional(readOnly = true)
    public QuizQuestionResponse getRandomReviewQuestion(Long userId) {
        List<WrongNote> wrongNotes = wrongNoteRepository.findByUserIdOrderByLastWrongAtDesc(userId);
        if (wrongNotes.isEmpty()) {
            throw new IllegalArgumentException("복습할 오답노트가 없습니다.");
        }

        List<KanaLesson> lessons = kanaLessonRepository.findAll();
        if (lessons.isEmpty()) {
            throw new IllegalArgumentException("Lesson data is empty.");
        }

        WrongNote wrongNote = wrongNotes.get(ThreadLocalRandom.current().nextInt(wrongNotes.size()));
        return createQuestionResponse(wrongNote.getLesson(), lessons);
    }

    @Transactional
    public QuizAnswerResponse answer(Long userId, QuizAnswerRequest request) {
        if (request.getLessonId() == null) {
            throw new IllegalArgumentException("lessonId is required.");
        }
        if (request.getAnswer() == null || request.getAnswer().isBlank()) {
            throw new IllegalArgumentException("answer is required.");
        }

        KanaLesson lesson = kanaLessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found."));

        String correctAnswer = lesson.getRomaji();
        boolean correct = correctAnswer.equals(request.getAnswer());
        boolean progressCompleted = false;
        boolean wrongNoteResolved = false;
        if (correct) {
            progressService.complete(userId, lesson.getId());
            progressCompleted = true;
            wrongNoteResolved = wrongNoteService.resolveWrongNoteIfExists(userId, lesson.getId());
        } else {
            wrongNoteService.recordWrong(userId, lesson.getId());
        }

        return new QuizAnswerResponse(correct, correctAnswer, progressCompleted, wrongNoteResolved);
    }

    private QuizQuestionResponse createQuestionResponse(KanaLesson question, List<KanaLesson> lessons) {
        return new QuizQuestionResponse(
                question.getId(),
                question.getType(),
                question.getKana(),
                createChoices(question, lessons)
        );
    }

    private List<String> createChoices(KanaLesson question, List<KanaLesson> lessons) {
        List<String> wrongChoices = lessons.stream()
                .map(KanaLesson::getRomaji)
                .filter(romaji -> !romaji.equals(question.getRomaji()))
                .distinct()
                .toList();

        if (wrongChoices.size() < CHOICE_COUNT - 1) {
            throw new IllegalArgumentException("Not enough lesson data to create quiz choices.");
        }

        List<String> shuffledWrongChoices = new ArrayList<>(wrongChoices);
        Collections.shuffle(shuffledWrongChoices);

        List<String> choices = new ArrayList<>();
        choices.add(question.getRomaji());
        choices.addAll(shuffledWrongChoices.subList(0, CHOICE_COUNT - 1));
        Collections.shuffle(choices);

        return choices;
    }
}
