package com.nihongo.backend.lesson.init;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.lesson.KanaType;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class KanaLessonDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(KanaLessonDataInitializer.class);

    private final KanaLessonRepository kanaLessonRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        long beforeCount = kanaLessonRepository.count();
        int insertedHiragana = seedMissingLessons(KanaType.HIRAGANA, hiragana());
        int insertedKatakana = seedMissingLessons(KanaType.KATAKANA, katakana());
        long afterCount = kanaLessonRepository.count();
        long hiraganaCount = kanaLessonRepository.countByType(KanaType.HIRAGANA);
        long katakanaCount = kanaLessonRepository.countByType(KanaType.KATAKANA);
        long distinctTypeAndKanaCount = kanaLessonRepository.countDistinctTypeAndKana();
        List<Object[]> duplicateRows = kanaLessonRepository.findDuplicateTypeAndKanaRows();
        List<String> unknownTypes = kanaLessonRepository.findUnknownTypes();

        log.info(
                "Kana lesson seed checked. beforeCount={}, insertedHiragana={}, insertedKatakana={}, afterCount={}, hiraganaCount={}, katakanaCount={}, distinctTypeAndKanaCount={}",
                beforeCount,
                insertedHiragana,
                insertedKatakana,
                afterCount,
                hiraganaCount,
                katakanaCount,
                distinctTypeAndKanaCount
        );

        if (!duplicateRows.isEmpty()) {
            log.warn("Duplicate kana lessons detected. duplicates={}", formatDuplicateRows(duplicateRows));
        }

        if (!unknownTypes.isEmpty()) {
            log.warn("Unknown kana lesson types detected. unknownTypes={}", unknownTypes);
        }
    }

    private int seedMissingLessons(KanaType type, String[][] data) {
        int insertedCount = 0;

        for (String[] item : data) {
            if (!kanaLessonRepository.existsByTypeAndKana(type, item[0])) {
                kanaLessonRepository.save(KanaLesson.builder()
                        .type(type)
                        .kana(item[0])
                        .romaji(item[1])
                        .build());
                insertedCount++;
            }
        }

        return insertedCount;
    }

    private String formatDuplicateRows(List<Object[]> duplicateRows) {
        return duplicateRows.stream()
                .map(row -> row[0] + ":" + row[1] + "=" + row[2])
                .collect(Collectors.joining(", "));
    }

    private String[][] hiragana() {
        return new String[][]{
                {"あ", "a"},
                {"い", "i"},
                {"う", "u"},
                {"え", "e"},
                {"お", "o"},
                {"か", "ka"},
                {"き", "ki"},
                {"く", "ku"},
                {"け", "ke"},
                {"こ", "ko"},
                {"さ", "sa"},
                {"し", "shi"},
                {"す", "su"},
                {"せ", "se"},
                {"そ", "so"},
                {"た", "ta"},
                {"ち", "chi"},
                {"つ", "tsu"},
                {"て", "te"},
                {"と", "to"},
                {"な", "na"},
                {"に", "ni"},
                {"ぬ", "nu"},
                {"ね", "ne"},
                {"の", "no"},
                {"は", "ha"},
                {"ひ", "hi"},
                {"ふ", "fu"},
                {"へ", "he"},
                {"ほ", "ho"},
                {"ま", "ma"},
                {"み", "mi"},
                {"む", "mu"},
                {"め", "me"},
                {"も", "mo"},
                {"や", "ya"},
                {"ゆ", "yu"},
                {"よ", "yo"},
                {"ら", "ra"},
                {"り", "ri"},
                {"る", "ru"},
                {"れ", "re"},
                {"ろ", "ro"},
                {"わ", "wa"},
                {"を", "wo"},
                {"ん", "n"},
                {"ゐ", "wi"},
                {"ゑ", "we"},
                {"ゔ", "vu"},
                {"っ", "small tsu"}
        };
    }

    private String[][] katakana() {
        return new String[][]{
                {"ア", "a"},
                {"イ", "i"},
                {"ウ", "u"},
                {"エ", "e"},
                {"オ", "o"},
                {"カ", "ka"},
                {"キ", "ki"},
                {"ク", "ku"},
                {"ケ", "ke"},
                {"コ", "ko"},
                {"サ", "sa"},
                {"シ", "shi"},
                {"ス", "su"},
                {"セ", "se"},
                {"ソ", "so"},
                {"タ", "ta"},
                {"チ", "chi"},
                {"ツ", "tsu"},
                {"テ", "te"},
                {"ト", "to"},
                {"ナ", "na"},
                {"ニ", "ni"},
                {"ヌ", "nu"},
                {"ネ", "ne"},
                {"ノ", "no"},
                {"ハ", "ha"},
                {"ヒ", "hi"},
                {"フ", "fu"},
                {"ヘ", "he"},
                {"ホ", "ho"},
                {"マ", "ma"},
                {"ミ", "mi"},
                {"ム", "mu"},
                {"メ", "me"},
                {"モ", "mo"},
                {"ヤ", "ya"},
                {"ユ", "yu"},
                {"ヨ", "yo"},
                {"ラ", "ra"},
                {"リ", "ri"},
                {"ル", "ru"},
                {"レ", "re"},
                {"ロ", "ro"},
                {"ワ", "wa"},
                {"ヲ", "wo"},
                {"ン", "n"},
                {"ヰ", "wi"},
                {"ヱ", "we"},
                {"ヴ", "vu"},
                {"ッ", "small tsu"}
        };
    }
}
