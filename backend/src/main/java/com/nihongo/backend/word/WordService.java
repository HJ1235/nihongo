package com.nihongo.backend.word;

import com.nihongo.backend.domain.word.Word;
import com.nihongo.backend.domain.word.WordLevel;
import com.nihongo.backend.domain.word.WordRepository;
import com.nihongo.backend.word.dto.WordQuizAnswerRequest;
import com.nihongo.backend.word.dto.WordQuizAnswerResponse;
import com.nihongo.backend.word.dto.WordQuizQuestionResponse;
import com.nihongo.backend.word.dto.WordResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class WordService {

    private static final int CHOICE_COUNT = 4;

    private final WordRepository wordRepository;

    @Transactional(readOnly = true)
    public List<WordResponse> getWords(WordLevel level) {
        return wordRepository.findByLevelOrderByIdAsc(defaultLevel(level))
                .stream()
                .map(WordResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public WordQuizQuestionResponse getRandomQuestion(WordLevel level) {
        WordLevel targetLevel = defaultLevel(level);
        List<Word> words = wordRepository.findByLevelOrderByIdAsc(targetLevel);
        if (words.isEmpty()) {
            throw new IllegalArgumentException("Word data is empty.");
        }

        Word question = words.get(ThreadLocalRandom.current().nextInt(words.size()));
        return new WordQuizQuestionResponse(
                question.getId(),
                question.getLevel(),
                question.getJapanese(),
                question.getReading(),
                createChoices(question, words)
        );
    }

    @Transactional(readOnly = true)
    public WordQuizAnswerResponse answer(WordQuizAnswerRequest request) {
        Word word = wordRepository.findById(request.getWordId())
                .orElseThrow(() -> new IllegalArgumentException("Word not found."));

        String correctAnswer = word.getMeaning();
        return new WordQuizAnswerResponse(correctAnswer.equals(request.getAnswer()), correctAnswer);
    }

    private WordLevel defaultLevel(WordLevel level) {
        return level == null ? WordLevel.N5 : level;
    }

    private List<String> createChoices(Word question, List<Word> words) {
        List<String> wrongChoices = words.stream()
                .map(Word::getMeaning)
                .filter(meaning -> !meaning.equals(question.getMeaning()))
                .distinct()
                .toList();

        if (wrongChoices.size() < CHOICE_COUNT - 1) {
            throw new IllegalArgumentException("Not enough word data to create quiz choices.");
        }

        List<String> shuffledWrongChoices = new ArrayList<>(wrongChoices);
        Collections.shuffle(shuffledWrongChoices);

        List<String> choices = new ArrayList<>();
        choices.add(question.getMeaning());
        choices.addAll(shuffledWrongChoices.subList(0, CHOICE_COUNT - 1));
        Collections.shuffle(choices);

        return choices;
    }
}
