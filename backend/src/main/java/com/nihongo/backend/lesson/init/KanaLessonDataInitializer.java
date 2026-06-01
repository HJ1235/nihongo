package com.nihongo.backend.lesson.init;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.lesson.KanaLessonRepository;
import com.nihongo.backend.domain.lesson.KanaType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class KanaLessonDataInitializer implements ApplicationRunner {

    private final KanaLessonRepository kanaLessonRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (kanaLessonRepository.count() > 0) {
            return;
        }

        List<KanaLesson> lessons = new ArrayList<>();
        addLessons(lessons, KanaType.HIRAGANA, hiragana());
        addLessons(lessons, KanaType.KATAKANA, katakana());

        kanaLessonRepository.saveAll(lessons);
    }

    private void addLessons(List<KanaLesson> lessons, KanaType type, String[][] data) {
        for (String[] item : data) {
            lessons.add(KanaLesson.builder()
                    .type(type)
                    .kana(item[0])
                    .romaji(item[1])
                    .build());
        }
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
                {"ん", "n"}
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
                {"ン", "n"}
        };
    }
}
