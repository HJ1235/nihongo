package com.nihongo.backend.word.init;

import com.nihongo.backend.domain.word.Word;
import com.nihongo.backend.domain.word.WordLevel;
import com.nihongo.backend.domain.word.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class WordDataInitializer implements ApplicationRunner {

    private final WordRepository wordRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (wordRepository.count() > 0) {
            return;
        }

        List<Word> words = new ArrayList<>();
        for (String[] item : n5Words()) {
            words.add(Word.builder()
                    .level(WordLevel.N5)
                    .japanese(item[0])
                    .reading(item[1])
                    .meaning(item[2])
                    .exampleSentence(item[3])
                    .exampleMeaning(item[4])
                    .build());
        }

        wordRepository.saveAll(words);
    }

    private String[][] n5Words() {
        return new String[][]{
                {"私", "わたし", "나/저", "私は学生です。", "저는 학생입니다."},
                {"学生", "がくせい", "학생", "私は学生です。", "저는 학생입니다."},
                {"先生", "せんせい", "선생님", "先生に聞きます。", "선생님께 묻습니다."},
                {"学校", "がっこう", "학교", "学校へ行きます。", "학교에 갑니다."},
                {"本", "ほん", "책", "本を読みます。", "책을 읽습니다."},
                {"水", "みず", "물", "水を飲みます。", "물을 마십니다."},
                {"火", "ひ", "불", "火に気をつけてください。", "불을 조심해 주세요."},
                {"人", "ひと", "사람", "あの人は先生です。", "저 사람은 선생님입니다."},
                {"日本", "にほん", "일본", "日本へ行きます。", "일본에 갑니다."},
                {"日本語", "にほんご", "일본어", "日本語を勉強します。", "일본어를 공부합니다."},
                {"今日", "きょう", "오늘", "今日は暑いです。", "오늘은 덥습니다."},
                {"明日", "あした", "내일", "明日学校へ行きます。", "내일 학교에 갑니다."},
                {"昨日", "きのう", "어제", "昨日映画を見ました。", "어제 영화를 봤습니다."},
                {"朝", "あさ", "아침", "朝ごはんを食べます。", "아침밥을 먹습니다."},
                {"夜", "よる", "밤", "夜に勉強します。", "밤에 공부합니다."},
                {"今", "いま", "지금", "今、何時ですか。", "지금 몇 시입니까?"},
                {"行く", "いく", "가다", "学校へ行きます。", "학교에 갑니다."},
                {"来る", "くる", "오다", "友だちが来ます。", "친구가 옵니다."},
                {"見る", "みる", "보다", "テレビを見ます。", "텔레비전을 봅니다."},
                {"食べる", "たべる", "먹다", "ごはんを食べます。", "밥을 먹습니다."},
                {"飲む", "のむ", "마시다", "水を飲みます。", "물을 마십니다."},
                {"読む", "よむ", "읽다", "本を読みます。", "책을 읽습니다."},
                {"書く", "かく", "쓰다", "名前を書きます。", "이름을 씁니다."},
                {"聞く", "きく", "듣다/묻다", "音楽を聞きます。", "음악을 듣습니다."},
                {"話す", "はなす", "말하다", "日本語を話します。", "일본어를 말합니다."},
                {"大きい", "おおきい", "크다", "大きい家です。", "큰 집입니다."},
                {"小さい", "ちいさい", "작다", "小さい犬です。", "작은 개입니다."},
                {"新しい", "あたらしい", "새롭다", "新しい本です。", "새 책입니다."},
                {"古い", "ふるい", "오래되다/낡다", "古い車です。", "오래된 차입니다."},
                {"安い", "やすい", "싸다", "この本は安いです。", "이 책은 쌉니다."}
        };
    }
}
