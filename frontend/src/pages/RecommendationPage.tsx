import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningMode, getRecommendations, updateLearningMode } from '../api/recommendationApi';
import type { CorrectionMode, LearningMode, ModeRecommendationResponse } from '../api/types';
import { Badge, Button, Card, PageHeader } from '../components/ui';

type PracticeDetail = {
  situation: string;
  expressions: PracticeExpression[];
  dialogue: Array<{ speaker: string; expression: PracticeExpression }>;
  prompt: string;
};

type PracticeExpression = {
  japanese: string;
  japaneseReading: string;
  koreanMeaning: string;
  koreanPronunciation: string;
};

type JapaneseTopic = {
  japanese: string;
  japaneseReading: string;
  koreanMeaning: string;
  koreanPronunciation: string;
};

function expression(
  japanese: string,
  japaneseReading: string,
  koreanMeaning: string,
  koreanPronunciation: string,
): PracticeExpression {
  return {
    japanese,
    japaneseReading,
    koreanMeaning,
    koreanPronunciation,
  };
}

const learningModeOptions: Array<{ label: string; value: LearningMode }> = [
  { label: '일반', value: 'GENERAL' },
  { label: '일본 취업', value: 'JAPAN_JOB' },
  { label: '워킹홀리데이', value: 'WORKING_HOLIDAY' },
  { label: '일상생활', value: 'DAILY_LIFE' },
  { label: 'JLPT', value: 'JLPT' },
];

const learningModeDescriptions: Record<LearningMode, string> = {
  GENERAL: '기초 문자와 기본 표현을 균형 있게 복습합니다.',
  JAPAN_JOB: '면접, 경어, 비즈니스 상황에서 바로 쓰는 표현을 연습합니다.',
  WORKING_HOLIDAY: '아르바이트, 행정, 주거, 병원처럼 현지 생활에 필요한 표현을 익힙니다.',
  DAILY_LIFE: '카페, 쇼핑, 약속, 은행처럼 일상에서 자주 만나는 상황을 연습합니다.',
  JLPT: '급수별 문법, 어휘, 독해, 청해를 시험 목표에 맞춰 정리합니다.',
};

const correctionModeByLearningMode: Record<LearningMode, CorrectionMode> = {
  GENERAL: 'GENERAL',
  JAPAN_JOB: 'JOB_INTERVIEW',
  WORKING_HOLIDAY: 'WORKING_HOLIDAY',
  DAILY_LIFE: 'DAILY_LIFE',
  JLPT: 'GENERAL',
};

const practiceDetails: Record<string, PracticeDetail> = {
  '편의점 알바 표현': {
    situation: '편의점 계산대에서 금액, 봉투 사용 여부, 거스름돈을 안내하는 상황입니다.',
    expressions: [
      expression('袋はご利用ですか。', 'ふくろはごりようですか。', '봉투 사용하시나요?', '후쿠로와 고리요우데스카'),
      expression('2,300円になります。', 'にせんさんびゃくえんになります。', '2,300엔입니다.', '니센산뱌쿠엔니 나리마스'),
      expression('200円のお返しです。', 'にひゃくえんのおかえしです。', '200엔 거스름돈입니다.', '니햐쿠엔노 오카에시데스'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('合計で2,300円になります。', 'ごうけいでにせんさんびゃくえんになります。', '합계 2,300엔입니다.', '고우케이데 니센산뱌쿠엔니 나리마스') },
      { speaker: '사용자', expression: expression('はい。', 'はい。', '네.', '하이') },
      { speaker: '상대방', expression: expression('袋はご利用ですか。', 'ふくろはごりようですか。', '봉투 사용하시나요?', '후쿠로와 고리요우데스카') },
      { speaker: '사용자', expression: expression('はい、お願いします。', 'はい、おねがいします。', '네, 부탁드립니다.', '하이 오네가이시마스') },
      { speaker: '상대방', expression: expression('200円のお返しです。', 'にひゃくえんのおかえしです。', '200엔 거스름돈입니다.', '니햐쿠엔노 오카에시데스') },
    ],
    prompt: '"봉투 부탁드립니다. 감사합니다."를 일본어로 작성해보세요.',
  },
  '음식점 주문/응대': {
    situation: '예약 없이 음식점에 들어가 인원수와 좌석 가능 여부를 확인하는 상황입니다.',
    expressions: [
      expression('4人です。', 'よにんです。', '4명입니다.', '요닌데스'),
      expression('予約していません。', 'よやくしていません。', '예약하지 않았습니다.', '요야쿠시테이마센'),
      expression('テーブル席はありますか。', 'てーぶるせきはありますか。', '테이블석 있나요?', '테-부루세키와 아리마스카'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('何名様ですか。', 'なんめいさまですか。', '몇 분이신가요?', '난메이사마데스카') },
      { speaker: '사용자', expression: expression('4人です。', 'よにんです。', '4명입니다.', '요닌데스') },
      { speaker: '상대방', expression: expression('ご予約はされていますか。', 'ごよやくはされていますか。', '예약하셨나요?', '고요야쿠와 사레테이마스카') },
      { speaker: '사용자', expression: expression('いいえ、予約していません。', 'いいえ、よやくしていません。', '아니요, 예약하지 않았습니다.', '이이에 요야쿠시테이마센') },
    ],
    prompt: '"4명입니다. 예약은 하지 않았습니다."를 일본어로 작성해보세요.',
  },
  '구약소(区役所) 전입신고': {
    situation: '일본에 도착한 뒤 주소 등록을 위해 구약소에서 전입신고를 하는 상황입니다.',
    expressions: [
      expression('転入届を出したいです。', 'てんにゅうとどけをだしたいです。', '전입신고를 하고 싶습니다.', '텐뉴우토도케오 다시타이데스'),
      expression('住所登録をしたいです。', 'じゅうしょとうろくをしたいです。', '주소 등록을 하고 싶습니다.', '주우쇼토우로쿠오 시타이데스'),
      expression('在留カードを持っています。', 'ざいりゅうかーどをもっています。', '재류카드를 가지고 있습니다.', '자이류우카-도오 못테이마스'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('今日はどのような手続きですか。', 'きょうはどのようなてつづきですか。', '오늘은 어떤 절차로 오셨나요?', '쿄우와 도노요우나 테츠즈키데스카') },
      { speaker: '사용자', expression: expression('転入届を出したいです。', 'てんにゅうとどけをだしたいです。', '전입신고를 하고 싶습니다.', '텐뉴우토도케오 다시타이데스') },
      { speaker: '상대방', expression: expression('在留カードはありますか。', 'ざいりゅうかーどはありますか。', '재류카드가 있나요?', '자이류우카-도와 아리마스카') },
      { speaker: '사용자', expression: expression('はい、持っています。', 'はい、もっています。', '네, 가지고 있습니다.', '하이 못테이마스') },
    ],
    prompt: '"삿포로로 이사 와서 전입신고를 하러 왔습니다."를 일본어로 작성해보세요.',
  },
  '주민표(住民票) 발급': {
    situation: '은행 계좌 개설이나 회사 제출용으로 주민표를 발급받는 상황입니다.',
    expressions: [
      expression('住民票を一通お願いします。', 'じゅうみんひょうをいっつうおねがいします。', '주민표 한 통 부탁드립니다.', '주우민효우오 잇츠우 오네가이시마스'),
      expression('会社に提出します。', 'かいしゃにていしゅつします。', '회사에 제출합니다.', '카이샤니 테이슈츠시마스'),
      expression('本人確認書類はこちらです。', 'ほんにんかくにんしょるいはこちらです。', '본인 확인 서류는 이것입니다.', '혼닌카쿠닌쇼루이와 코치라데스'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('住民票は何通必要ですか。', 'じゅうみんひょうはなんつうひつようですか。', '주민표 몇 통 필요하신가요?', '주우민효우와 난츠우 히츠요우데스카') },
      { speaker: '사용자', expression: expression('一通お願いします。', 'いっつうおねがいします。', '한 통 부탁드립니다.', '잇츠우 오네가이시마스') },
      { speaker: '상대방', expression: expression('使用目的は何ですか。', 'しようもくてきはなんですか。', '사용 목적은 무엇인가요?', '시요우모쿠테키와 난데스카') },
      { speaker: '사용자', expression: expression('会社に提出します。', 'かいしゃにていしゅつします。', '회사에 제출합니다.', '카이샤니 테이슈츠시마스') },
    ],
    prompt: '"회사에 제출하려고 주민표 한 통이 필요합니다."를 일본어로 작성해보세요.',
  },
  '국민건강보험 가입': {
    situation: '일본 체류 중 병원 이용을 위해 국민건강보험에 가입하는 상황입니다.',
    expressions: [
      expression('国民健康保険に加入したいです。', 'こくみんけんこうほけんにかにゅうしたいです。', '국민건강보험에 가입하고 싶습니다.', '코쿠민켄코우호켄니 카뉴우시타이데스'),
      expression('保険料はいくらですか。', 'ほけんりょうはいくらですか。', '보험료는 얼마인가요?', '호켄료우와 이쿠라데스카'),
      expression('いつから使えますか。', 'いつからつかえますか。', '언제부터 사용할 수 있나요?', '이츠카라 츠카에마스카'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('国民健康保険の加入ですね。', 'こくみんけんこうほけんのかにゅうですね。', '국민건강보험 가입이시군요.', '코쿠민켄코우호켄노 카뉴우데스네') },
      { speaker: '사용자', expression: expression('はい、加入したいです。', 'はい、かにゅうしたいです。', '네, 가입하고 싶습니다.', '하이 카뉴우시타이데스') },
      { speaker: '상대방', expression: expression('在留カードを確認します。', 'ざいりゅうかーどをかくにんします。', '재류카드를 확인하겠습니다.', '자이류우카-도오 카쿠닌시마스') },
      { speaker: '사용자', expression: expression('いつから使えますか。', 'いつからつかえますか。', '언제부터 사용할 수 있나요?', '이츠카라 츠카에마스카') },
    ],
    prompt: '"국민건강보험에 가입하고 싶습니다. 언제부터 사용할 수 있나요?"를 일본어로 작성해보세요.',
  },
  '마이넘버 관련 표현': {
    situation: '구약소에서 마이넘버카드를 신청하고 신청서 작성 방법을 묻는 상황입니다.',
    expressions: [
      expression('マイナンバーカードを作りに来ました。', 'まいなんばーかーどをつくりにきました。', '마이넘버카드를 만들러 왔습니다.', '마이난바-카-도오 츠쿠리니 키마시타'),
      expression('申請書はまだ書いていません。', 'しんせいしょはまだかいていません。', '신청서는 아직 작성하지 않았습니다.', '신세이쇼와 마다 카이테이마센'),
      expression('どこに書けばいいですか。', 'どこにかけばいいですか。', '어디에 쓰면 되나요?', '도코니 카케바 이이데스카'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('今日はどうされましたか。', 'きょうはどうされましたか。', '오늘은 어떻게 오셨나요?', '쿄우와 도우사레마시타카') },
      { speaker: '사용자', expression: expression('マイナンバーカードを作りに来ました。', 'まいなんばーかーどをつくりにきました。', '마이넘버카드를 만들러 왔습니다.', '마이난바-카-도오 츠쿠리니 키마시타') },
      { speaker: '상대방', expression: expression('申請書は書きましたか。', 'しんせいしょはかきましたか。', '신청서는 작성하셨나요?', '신세이쇼와 카키마시타카') },
      { speaker: '사용자', expression: expression('いいえ、まだ書いていません。', 'いいえ、まだかいていません。', '아니요, 아직 작성하지 않았습니다.', '이이에 마다 카이테이마센') },
    ],
    prompt: '"마이넘버카드를 만들러 왔습니다. 신청서는 아직 작성하지 않았습니다."를 일본어로 작성해보세요.',
  },
  '병원 방문 표현': {
    situation: '처음 방문한 병원 접수에서 보험증을 제시하고 증상을 말하는 상황입니다.',
    expressions: [
      expression('初めて来ました。', 'はじめてきました。', '처음 왔습니다.', '하지메테 키마시타'),
      expression('保険証を持っています。', 'ほけんしょうをもっています。', '보험증을 가지고 있습니다.', '호켄쇼우오 못테이마스'),
      expression('頭が痛いです。', 'あたまがいたいです。', '머리가 아픕니다.', '아타마가 이타이데스'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('今日はどうされましたか。', 'きょうはどうされましたか。', '오늘은 어떻게 오셨나요?', '쿄우와 도우사레마시타카') },
      { speaker: '사용자', expression: expression('頭が痛いです。', 'あたまがいたいです。', '머리가 아픕니다.', '아타마가 이타이데스') },
      { speaker: '상대방', expression: expression('こちらの病院は初めてですか。', 'こちらのびょういんははじめてですか。', '이 병원은 처음이신가요?', '코치라노 뵤우인와 하지메테데스카') },
      { speaker: '사용자', expression: expression('はい、初めて来ました。', 'はい、はじめてきました。', '네, 처음 왔습니다.', '하이 하지메테 키마시타') },
    ],
    prompt: '"처음 왔습니다. 보험증을 가지고 있습니다. 머리가 아픕니다."를 일본어로 작성해보세요.',
  },
  '집 구하기 표현': {
    situation: '부동산에서 월세, 역까지 거리, 내견 가능 여부를 확인하는 상황입니다.',
    expressions: [
      expression('家賃はいくらですか。', 'やちんはいくらですか。', '월세는 얼마인가요?', '야친와 이쿠라데스카'),
      expression('駅からどのくらいですか。', 'えきからどのくらいですか。', '역에서 얼마나 걸리나요?', '에키카라 도노쿠라이데스카'),
      expression('内見できますか。', 'ないけんできますか。', '내견할 수 있나요?', '나이켄데키마스카'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('どのようなお部屋をお探しですか。', 'どのようなおへやをおさがしですか。', '어떤 방을 찾고 계신가요?', '도노요우나 오헤야오 오사가시데스카') },
      { speaker: '사용자', expression: expression('駅に近い部屋を探しています。', 'えきにちかいへやをさがしています。', '역에서 가까운 방을 찾고 있습니다.', '에키니 치카이 헤야오 사가시테이마스') },
      { speaker: '상대방', expression: expression('こちらの物件はいかがですか。', 'こちらのぶっけんはいかがですか。', '이 매물은 어떠신가요?', '코치라노 붓켄와 이카가데스카') },
      { speaker: '사용자', expression: expression('内見できますか。', 'ないけんできますか。', '내견할 수 있나요?', '나이켄데키마스카') },
    ],
    prompt: '"역에서 가까운 방을 찾고 있습니다. 내견할 수 있나요?"를 일본어로 작성해보세요.',
  },
};

const japaneseTopicByRecommendation: Record<string, JapaneseTopic> = {
  '면접 자기소개 연습': { japanese: '面接での自己紹介', japaneseReading: 'めんせつでのじこしょうかい', koreanMeaning: '면접에서의 자기소개', koreanPronunciation: '멘세츠데노 지코쇼우카이' },
  '경어 표현 학습': { japanese: '敬語表現', japaneseReading: 'けいごひょうげん', koreanMeaning: '경어 표현', koreanPronunciation: '케이고효우겐' },
  '비즈니스 메일 작성': { japanese: 'ビジネスメールの書き方', japaneseReading: 'びじねすめーるのかきかた', koreanMeaning: '비즈니스 메일 작성법', koreanPronunciation: '비지네스메-루노 카키카타' },
  '전화 응대 표현': { japanese: '電話対応の表現', japaneseReading: 'でんわたいおうのひょうげん', koreanMeaning: '전화 응대 표현', koreanPronunciation: '덴와타이오우노 효우겐' },
  '이력서/직무경력서 표현': { japanese: '履歴書や職務経歴書の表現', japaneseReading: 'りれきしょやしょくむけいれきしょのひょうげん', koreanMeaning: '이력서와 직무경력서 표현', koreanPronunciation: '리레키쇼야 쇼쿠무케이레키쇼노 효우겐' },
  '회사 생활 표현': { japanese: '会社でのコミュニケーション', japaneseReading: 'かいしゃでのこみゅにけーしょん', koreanMeaning: '회사에서의 커뮤니케이션', koreanPronunciation: '카이샤데노 커뮤니케-숀' },
  '카페 주문': { japanese: 'カフェでの注文', japaneseReading: 'かふぇでのちゅうもん', koreanMeaning: '카페에서 주문하기', koreanPronunciation: '카페데노 추우몬' },
  '길 묻기': { japanese: '道の尋ね方', japaneseReading: 'みちのたずねかた', koreanMeaning: '길 묻는 방법', koreanPronunciation: '미치노 타즈네카타' },
  쇼핑: { japanese: '買い物での会話', japaneseReading: 'かいもののかいわ', koreanMeaning: '쇼핑할 때의 대화', koreanPronunciation: '카이모노데노 카이와' },
  '약속 잡기': { japanese: '約束の決め方', japaneseReading: 'やくそくのきめかた', koreanMeaning: '약속 잡는 방법', koreanPronunciation: '야쿠소쿠노 키메카타' },
  '택배 수령': { japanese: '荷物の受け取り', japaneseReading: 'にもつのうけとり', koreanMeaning: '택배 수령', koreanPronunciation: '니모츠노 우케토리' },
  '은행 계좌 개설': { japanese: '銀行口座の開設', japaneseReading: 'ぎんこうこうざのかいせつ', koreanMeaning: '은행 계좌 개설', koreanPronunciation: '긴코우코우자노 카이세츠' },
  '휴대폰 개통': { japanese: '携帯電話の契約', japaneseReading: 'けいたいでんわのけいやく', koreanMeaning: '휴대폰 계약', koreanPronunciation: '케이타이덴와노 케이야쿠' },
  '구약소 민원 처리': { japanese: '区役所での手続き', japaneseReading: 'くやくしょでのてつづき', koreanMeaning: '구약소에서의 민원 처리', koreanPronunciation: '쿠야쿠쇼데노 테츠즈키' },
  'N5 기초 문법': { japanese: 'N5の基礎文法', japaneseReading: 'えぬごのきそぶんぽう', koreanMeaning: 'N5 기초 문법', koreanPronunciation: '엔고노 키소분포우' },
  'N4 동사 활용': { japanese: 'N4の動詞活用', japaneseReading: 'えぬよんのどうしかつよう', koreanMeaning: 'N4 동사 활용', koreanPronunciation: '엔욘노 도우시카츠요우' },
  'N3 독해': { japanese: 'N3の読解', japaneseReading: 'えぬさんのどっかい', koreanMeaning: 'N3 독해', koreanPronunciation: '엔산노 돗카이' },
  'N2/N1 어휘': { japanese: 'N2・N1の語彙', japaneseReading: 'えぬに・えぬいちのごい', koreanMeaning: 'N2/N1 어휘', koreanPronunciation: '엔니 엔이치노 고이' },
  '청해 연습': { japanese: '聴解練習', japaneseReading: 'ちょうかいれんしゅう', koreanMeaning: '청해 연습', koreanPronunciation: '초우카이렌슈우' },
  '독해 문제 풀이': { japanese: '読解問題', japaneseReading: 'どっかいもんだい', koreanMeaning: '독해 문제', koreanPronunciation: '돗카이몬다이' },
  '히라가나 복습': { japanese: 'ひらがなの復習', japaneseReading: 'ひらがなのふくしゅう', koreanMeaning: '히라가나 복습', koreanPronunciation: '히라가나노 후쿠슈우' },
  '가타카나 복습': { japanese: 'カタカナの復習', japaneseReading: 'かたかなのふくしゅう', koreanMeaning: '가타카나 복습', koreanPronunciation: '카타카나노 후쿠슈우' },
  '기본 인사': { japanese: '基本のあいさつ', japaneseReading: 'きほんのあいさつ', koreanMeaning: '기본 인사', koreanPronunciation: '키혼노 아이사츠' },
  '기초 문장 만들기': { japanese: '基本文の作り方', japaneseReading: 'きほんぶんのつくりかた', koreanMeaning: '기초 문장 만들기', koreanPronunciation: '키혼분노 츠쿠리카타' },
};

function getFallbackDetail(title: string, modeLabel: string): PracticeDetail {
  const topic =
    japaneseTopicByRecommendation[title] ??
    { japanese: 'このテーマ', japaneseReading: 'このてーま', koreanMeaning: '이 주제', koreanPronunciation: '코노 테-마' };

  return {
    situation: `${modeLabel} 목표에 맞춰 "${title}" 상황에서 바로 쓸 수 있는 문장을 연습합니다.`,
    expressions: [
      expression(
        `${topic.japanese}について練習したいです。`,
        `${topic.japaneseReading}についてれんしゅうしたいです。`,
        `${topic.koreanMeaning}에 대해 연습하고 싶습니다.`,
        `${topic.koreanPronunciation}니 츠이테 렌슈우시타이데스`,
      ),
      expression('例文を作ってみます。', 'れいぶんをつくってみます。', '예문을 만들어 보겠습니다.', '레이분오 츠쿳테미마스'),
      expression('自然な表現に直したいです。', 'しぜんなひょうげんになおしたいです。', '자연스러운 표현으로 고치고 싶습니다.', '시젠나 효우겐니 나오시타이데스'),
    ],
    dialogue: [
      { speaker: '상대방', expression: expression('今日は何を練習しますか。', 'きょうはなにをれんしゅうしますか。', '오늘은 무엇을 연습할까요?', '쿄우와 나니오 렌슈우시마스카') },
      {
        speaker: '사용자',
        expression: expression(
          `${topic.japanese}について練習したいです。`,
          `${topic.japaneseReading}についてれんしゅうしたいです。`,
          `${topic.koreanMeaning}에 대해 연습하고 싶습니다.`,
          `${topic.koreanPronunciation}니 츠이테 렌슈우시타이데스`,
        ),
      },
      { speaker: '상대방', expression: expression('では、例文を作ってみましょう。', 'では、れいぶんをつくってみましょう。', '그럼 예문을 만들어 봅시다.', '데와 레이분오 츠쿳테미마쇼우') },
      { speaker: '사용자', expression: expression('自然な表現に直したいです。', 'しぜんなひょうげんになおしたいです。', '자연스러운 표현으로 고치고 싶습니다.', '시젠나 효우겐니 나오시타이데스') },
    ],
    prompt: `"${title}" 상황에서 사용할 일본어 문장을 직접 작성해보세요.`,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function RecommendationPage() {
  const navigate = useNavigate();
  const [learningMode, setLearningMode] = useState<LearningMode>('GENERAL');
  const [recommendations, setRecommendations] = useState<ModeRecommendationResponse | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingMode, setUpdatingMode] = useState<LearningMode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeModeLabel = useMemo(
    () => learningModeOptions.find((option) => option.value === learningMode)?.label ?? '일반',
    [learningMode],
  );

  const selectedDetail = useMemo(() => {
    if (!selectedRecommendation) {
      return null;
    }

    return practiceDetails[selectedRecommendation] ?? getFallbackDetail(selectedRecommendation, activeModeLabel);
  }, [activeModeLabel, selectedRecommendation]);

  const loadRecommendations = async () => {
    const response = await getRecommendations();

    if (!response.success) {
      throw new Error(response.message ?? '추천 학습 콘텐츠를 불러오지 못했습니다.');
    }

    setRecommendations(response.data);
    setLearningMode(response.data.learningMode);
    setSelectedRecommendation((current) =>
      current && response.data.recommendations.includes(current) ? current : response.data.recommendations[0] ?? null,
    );
    setPracticeAnswer('');
  };

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const modeResponse = await getLearningMode();

        if (!modeResponse.success) {
          throw new Error(modeResponse.message ?? '학습 모드를 불러오지 못했습니다.');
        }

        setLearningMode(modeResponse.data.learningMode);
        await loadRecommendations();
      } catch (error) {
        setErrorMessage(getErrorMessage(error, '추천 학습 정보를 불러오지 못했습니다.'));
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  const handleModeChange = async (nextMode: LearningMode) => {
    if (nextMode === learningMode || updatingMode) {
      return;
    }

    setUpdatingMode(nextMode);
    setErrorMessage(null);

    try {
      const response = await updateLearningMode({ learningMode: nextMode });

      if (!response.success) {
        throw new Error(response.message ?? '학습 모드를 변경하지 못했습니다.');
      }

      setLearningMode(response.data.learningMode);
      setSelectedRecommendation(null);
      await loadRecommendations();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '학습 모드를 변경하지 못했습니다.'));
    } finally {
      setUpdatingMode(null);
    }
  };

  const handleSelectRecommendation = (recommendation: string) => {
    setSelectedRecommendation(recommendation);
    setPracticeAnswer('');
  };

  const handlePracticeCorrection = () => {
    navigate('/corrections', {
      state: {
        initialText: practiceAnswer,
        mode: correctionModeByLearningMode[learningMode],
      },
    });
  };

  return (
    <main className="page-layout">
      <PageHeader
        description="목표에 맞는 일본어 상황 학습을 추천합니다."
        eyebrow="Recommendations"
        title="목적별 추천 학습"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <section className="recommendation-layout">
        <Card className="mode-selector-card">
          <div className="mode-selector-header">
            <div>
              <Badge>현재 모드</Badge>
              <h2>{activeModeLabel}</h2>
            </div>
            <p>{learningModeDescriptions[learningMode]}</p>
          </div>

          <div className="mode-option-grid">
            {learningModeOptions.map((option) => (
              <Button
                className={option.value === learningMode ? 'selected' : undefined}
                disabled={loading || updatingMode !== null}
                key={option.value}
                onClick={() => handleModeChange(option.value)}
                type="button"
                variant="secondary"
              >
                {updatingMode === option.value ? '변경 중...' : option.label}
              </Button>
            ))}
          </div>
        </Card>

        <section className="recommendation-content">
          {loading && <p className="status-text">추천 학습 콘텐츠를 불러오는 중입니다...</p>}

          {!loading && recommendations && (
            <>
              <div className="recommendation-section-header">
                <h2>{activeModeLabel} 추천 콘텐츠</h2>
                <Badge>{recommendations.recommendations.length}개</Badge>
              </div>

              <div className="recommendation-grid">
                {recommendations.recommendations.map((recommendation, index) => (
                  <button
                    className={
                      recommendation === selectedRecommendation
                        ? 'recommendation-card-button selected'
                        : 'recommendation-card-button'
                    }
                    key={recommendation}
                    onClick={() => handleSelectRecommendation(recommendation)}
                    type="button"
                  >
                    <div className="recommendation-card">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{recommendation}</strong>
                      <p>{activeModeLabel} 목표에 맞춰 바로 연습하기 좋은 학습 주제입니다.</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {!loading && !recommendations && !errorMessage && (
            <p className="empty-state">추천할 학습 콘텐츠가 아직 없습니다.</p>
          )}
        </section>
      </section>

      {selectedRecommendation && selectedDetail && (
        <section className="practice-panel">
          <Card className="practice-card">
            <div className="practice-heading">
              <Badge>실습형 학습</Badge>
              <h2>{selectedRecommendation}</h2>
            </div>

            <div className="practice-section">
              <h3>상황 설명</h3>
              <p>{selectedDetail.situation}</p>
            </div>

            <div className="practice-section">
              <h3>필수 표현</h3>
              <div className="expression-list">
                {selectedDetail.expressions.map((expression) => (
                  <div className="expression-card" key={expression.japanese}>
                    <strong>{expression.japanese}</strong>
                    <dl>
                      <div>
                        <dt>일본어 발음</dt>
                        <dd>{expression.japaneseReading}</dd>
                      </div>
                      <div>
                        <dt>한국어 해석</dt>
                        <dd>{expression.koreanMeaning}</dd>
                      </div>
                      <div>
                        <dt>한국어 발음</dt>
                        <dd>{expression.koreanPronunciation}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>

            <div className="practice-section">
              <h3>예시 대화</h3>
              <div className="dialogue-list">
                {selectedDetail.dialogue.map((line, index) => (
                  <p key={`${line.speaker}-${index}`}>
                    <strong>{line.speaker}</strong>
                    <span className="dialogue-japanese">{line.expression.japanese}</span>
                    <small>{line.expression.japaneseReading}</small>
                    <small>{line.expression.koreanMeaning}</small>
                    <small>{line.expression.koreanPronunciation}</small>
                  </p>
                ))}
              </div>
            </div>

            <div className="practice-section">
              <h3>실습 문제</h3>
              <p>{selectedDetail.prompt}</p>
              <textarea
                className="ui-textarea practice-textarea"
                onChange={(event) => setPracticeAnswer(event.target.value)}
                placeholder="일본어 답안을 입력해보세요."
                value={practiceAnswer}
              />
              {practiceAnswer.trim() && (
                <div className="my-answer">
                  <span>내 답안</span>
                  <p>{practiceAnswer}</p>
                </div>
              )}
            </div>

            <Button onClick={handlePracticeCorrection} type="button">
              AI 교정으로 연습하기
            </Button>
          </Card>
        </section>
      )}
    </main>
  );
}

export default RecommendationPage;
