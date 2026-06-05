import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearningMode, getRecommendations, updateLearningMode } from '../api/recommendationApi';
import type { CorrectionMode, LearningMode, ModeRecommendationResponse } from '../api/types';
import { Badge, Button, Card, PageHeader } from '../components/ui';

type PracticeDetail = {
  situation: string;
  expressions: string[];
  dialogue: Array<{ speaker: string; text: string }>;
  prompt: string;
};

const learningModeOptions: Array<{ label: string; value: LearningMode }> = [
  { label: '일반', value: 'GENERAL' },
  { label: '일본 취업', value: 'JAPAN_JOB' },
  { label: '워킹홀리데이', value: 'WORKING_HOLIDAY' },
  { label: '일상생활', value: 'DAILY_LIFE' },
  { label: 'JLPT', value: 'JLPT' },
];

const learningModeDescriptions: Record<LearningMode, string> = {
  GENERAL: '기초 문자와 기본 표현을 균형 있게 복습합니다.',
  JAPAN_JOB: '면접, 경어, 회사 생활에 바로 쓰는 표현을 중심으로 학습합니다.',
  WORKING_HOLIDAY: '알바, 행정, 주거, 병원처럼 현지 생활 초반에 필요한 표현을 익힙니다.',
  DAILY_LIFE: '카페, 쇼핑, 택배, 은행처럼 일상에서 자주 만나는 상황을 연습합니다.',
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
    situation: '편의점 계산대에서 손님에게 금액, 봉투 사용 여부, 거스름돈을 안내하는 상황입니다.',
    expressions: ['袋はご利用ですか。', '2,300円になります。', '200円のお返しです。'],
    dialogue: [
      { speaker: '상대방', text: '合計で2,300円になります。' },
      { speaker: '사용자', text: 'はい。' },
      { speaker: '상대방', text: '袋はご利用ですか。' },
      { speaker: '사용자', text: 'はい、お願いします。' },
      { speaker: '상대방', text: '200円のお返しです。' },
      { speaker: '사용자', text: 'ありがとうございます。' },
    ],
    prompt: '"봉투 부탁드립니다. 감사합니다."를 일본어로 작성해보세요.',
  },
  '음식점 주문/응대': {
    situation: '예약 없이 음식점에 들어가 인원수와 좌석 가능 여부를 확인하는 상황입니다.',
    expressions: ['4人です。', '予約していません。', 'テーブル席はありますか。'],
    dialogue: [
      { speaker: '상대방', text: '何名様ですか。' },
      { speaker: '사용자', text: '4人です。' },
      { speaker: '상대방', text: 'ご予約はされていますか。' },
      { speaker: '사용자', text: 'いいえ、予約していません。' },
    ],
    prompt: '"4명입니다. 예약은 하지 않았습니다."를 일본어로 작성해보세요.',
  },
  '집 구하기 표현': {
    situation: '부동산에서 월세, 역까지 거리, 내견 가능 여부를 확인하는 상황입니다.',
    expressions: ['家賃はいくらですか。', '駅からどのくらいですか。', '内見できますか。'],
    dialogue: [
      { speaker: '상대방', text: 'どのようなお部屋をお探しですか。' },
      { speaker: '사용자', text: '駅に近い部屋を探しています。' },
      { speaker: '상대방', text: 'こちらの物件はいかがですか。' },
      { speaker: '사용자', text: '家賃はいくらですか。内見できますか。' },
    ],
    prompt: '"역에서 가까운 방을 찾고 있습니다. 내견할 수 있나요?"를 일본어로 작성해보세요.',
  },
  '병원 방문 표현': {
    situation: '처음 방문한 병원 접수에서 보험증을 제시하고 증상을 말하는 상황입니다.',
    expressions: ['初めて来ました。', '保険証を持っています。', '頭が痛いです。'],
    dialogue: [
      { speaker: '상대방', text: '今日はどうされましたか。' },
      { speaker: '사용자', text: '頭が痛いです。' },
      { speaker: '상대방', text: 'こちらの病院は初めてですか。' },
      { speaker: '사용자', text: 'はい、初めて来ました。保険証を持っています。' },
    ],
    prompt: '"처음 왔습니다. 보험증을 가지고 있습니다. 머리가 아픕니다."를 일본어로 작성해보세요.',
  },
  '구약소(区役所) 전입신고': {
    situation: '일본에 도착한 뒤 주소 등록을 위해 구약소에서 전입신고를 하는 상황입니다.',
    expressions: ['転入届を出したいです。', '住所登録をしたいです。', '在留カードを持っています。'],
    dialogue: [
      { speaker: '상대방', text: '今日はどのような手続きですか。' },
      { speaker: '사용자', text: '転入届を出したいです。' },
      { speaker: '상대방', text: '在留カードはありますか。' },
      { speaker: '사용자', text: 'はい、持っています。' },
    ],
    prompt: '"삿포로로 이사 와서 전입신고를 하러 왔습니다."를 일본어로 작성해보세요.',
  },
  '주민표(住民票) 발급': {
    situation: '은행 계좌 개설이나 회사 제출용으로 주민표를 발급받는 상황입니다.',
    expressions: ['住民票を一通お願いします。', '会社に提出します。', '本人確認書類はこちらです。'],
    dialogue: [
      { speaker: '상대방', text: '住民票は何通必要ですか。' },
      { speaker: '사용자', text: '一通お願いします。' },
      { speaker: '상대방', text: '使用目的は何ですか。' },
      { speaker: '사용자', text: '会社に提出します。本人確認書類はこちらです。' },
    ],
    prompt: '"회사에 제출하려고 주민표 한 통이 필요합니다."를 일본어로 작성해보세요.',
  },
  '국민건강보험 가입': {
    situation: '일본 체류 중 병원 이용을 위해 국민건강보험에 가입하는 상황입니다.',
    expressions: ['国民健康保険に加入したいです。', '保険料はいくらですか。', 'いつから使えますか。'],
    dialogue: [
      { speaker: '상대방', text: '国民健康保険の加入ですね。' },
      { speaker: '사용자', text: 'はい、加入したいです。' },
      { speaker: '상대방', text: '在留カードを確認します。' },
      { speaker: '사용자', text: '保険料はいくらですか。いつから使えますか。' },
    ],
    prompt: '"국민건강보험에 가입하고 싶습니다. 언제부터 사용할 수 있나요?"를 일본어로 작성해보세요.',
  },
  '마이넘버 관련 표현': {
    situation: '구약소에서 마이넘버카드를 신청하고 신청서 작성 방법을 묻는 상황입니다.',
    expressions: ['マイナンバーカードを作りに来ました。', '申請書はまだ書いていません。', 'どこに書けばいいですか。'],
    dialogue: [
      { speaker: '상대방', text: '今日はどうされましたか。' },
      { speaker: '사용자', text: 'マイナンバーカードを作りに来ました。' },
      { speaker: '상대방', text: '申請書は書きましたか。' },
      { speaker: '사용자', text: 'いいえ、まだ書いていません。' },
    ],
    prompt: '"마이넘버카드를 만들러 왔습니다. 신청서는 아직 작성하지 않았습니다."를 일본어로 작성해보세요.',
  },
  '택배 수령': {
    situation: '부재중이던 택배를 재배달받거나 편의점에서 수령하는 상황입니다.',
    expressions: ['荷物を受け取りに来ました。', '不在票を持っています。', '本人確認書類が必要ですか。'],
    dialogue: [
      { speaker: '상대방', text: 'お荷物の受け取りですか。' },
      { speaker: '사용자', text: 'はい、荷物を受け取りに来ました。' },
      { speaker: '상대방', text: '不在票はありますか。' },
      { speaker: '사용자', text: 'はい、持っています。本人確認書類が必要ですか。' },
    ],
    prompt: '"택배를 받으러 왔습니다. 부재표를 가지고 있습니다."를 일본어로 작성해보세요.',
  },
  '은행 계좌 개설': {
    situation: '은행 창구에서 새 계좌를 만들고 필요한 서류를 확인하는 상황입니다.',
    expressions: ['口座を開設したいです。', '在留カードを持っています。', '印鑑は必要ですか。'],
    dialogue: [
      { speaker: '상대방', text: '今日はどのようなご用件ですか。' },
      { speaker: '사용자', text: '口座を開設したいです。' },
      { speaker: '상대방', text: '本人確認書類はありますか。' },
      { speaker: '사용자', text: '在留カードを持っています。印鑑は必要ですか。' },
    ],
    prompt: '"은행 계좌를 만들고 싶습니다. 재류카드를 가지고 있습니다."를 일본어로 작성해보세요.',
  },
  '휴대폰 개통': {
    situation: '통신사 매장에서 휴대폰 계약과 요금제를 상담하는 상황입니다.',
    expressions: ['携帯電話を契約したいです。', '一番安いプランはどれですか。', '在留カードで申し込めますか。'],
    dialogue: [
      { speaker: '상대방', text: '新規契約でしょうか。' },
      { speaker: '사용자', text: 'はい、携帯電話を契約したいです。' },
      { speaker: '상대방', text: 'ご希望のプランはありますか。' },
      { speaker: '사용자', text: '一番安いプランはどれですか。' },
    ],
    prompt: '"휴대폰을 계약하고 싶습니다. 가장 저렴한 요금제는 어느 것인가요?"를 일본어로 작성해보세요.',
  },
  '구약소 민원 처리': {
    situation: '구약소 창구에서 어떤 창구로 가야 하는지 묻고 서류 작성 위치를 확인하는 상황입니다.',
    expressions: ['どの窓口に行けばいいですか。', 'この書類を書けばいいですか。', '番号札を取ればいいですか。'],
    dialogue: [
      { speaker: '상대방', text: 'ご用件をお伺いします。' },
      { speaker: '사용자', text: '住所の手続きをしたいです。' },
      { speaker: '상대방', text: 'こちらの書類を書いてください。' },
      { speaker: '사용자', text: 'どこに書けばいいですか。' },
    ],
    prompt: '"주소 관련 절차를 하고 싶습니다. 어느 창구로 가면 되나요?"를 일본어로 작성해보세요.',
  },
  '면접 자기소개 연습': {
    situation: '일본 회사 면접에서 자기소개와 지원 동기를 간단히 말하는 상황입니다.',
    expressions: ['本日はお時間をいただき、ありがとうございます。', '韓国から参りました。', '御社で働きたいと考えています。'],
    dialogue: [
      { speaker: '상대방', text: 'まず、自己紹介をお願いします。' },
      { speaker: '사용자', text: '韓国から参りました。キムと申します。' },
      { speaker: '상대방', text: '志望動機を教えてください。' },
      { speaker: '사용자', text: '日本語を活かして、御社で働きたいと考えています。' },
    ],
    prompt: '"한국에서 온 김이라고 합니다. 일본어를 살려서 귀사에서 일하고 싶습니다."를 일본어로 작성해보세요.',
  },
  '경어 표현 학습': {
    situation: '회사에서 상사에게 확인과 부탁을 정중하게 말하는 상황입니다.',
    expressions: ['確認していただけますでしょうか。', '少々お時間をいただけますか。', '承知いたしました。'],
    dialogue: [
      { speaker: '상대방', text: 'この資料を確認しましたか。' },
      { speaker: '사용자', text: 'はい、確認いたしました。' },
      { speaker: '상대방', text: '修正できますか。' },
      { speaker: '사용자', text: '承知いたしました。少々お時間をいただけますか。' },
    ],
    prompt: '"자료를 확인했습니다. 조금 시간을 받을 수 있을까요?"를 일본어로 작성해보세요.',
  },
  '비즈니스 메일 작성': {
    situation: '거래처에 회의 일정 확인 메일을 정중하게 보내는 상황입니다.',
    expressions: ['お世話になっております。', 'ご確認のほどよろしくお願いいたします。', 'ご都合はいかがでしょうか。'],
    dialogue: [
      { speaker: '상대방', text: '来週の打ち合わせの日程はいかがですか。' },
      { speaker: '사용자', text: '来週火曜日の午後はいかがでしょうか。' },
      { speaker: '상대방', text: '確認します。' },
      { speaker: '사용자', text: 'ご確認のほどよろしくお願いいたします。' },
    ],
    prompt: '"다음 주 화요일 오후는 어떠신가요? 확인 부탁드립니다."를 일본어로 작성해보세요.',
  },
  '전화 응대 표현': {
    situation: '회사 전화에서 담당자 부재를 안내하고 메시지를 받는 상황입니다.',
    expressions: ['少々お待ちください。', 'ただいま席を外しております。', '折り返しお電話いたします。'],
    dialogue: [
      { speaker: '상대방', text: '田中さんはいらっしゃいますか。' },
      { speaker: '사용자', text: '少々お待ちください。' },
      { speaker: '사용자', text: '申し訳ございません。ただいま席を外しております。' },
      { speaker: '상대방', text: 'では、折り返しお願いします。' },
    ],
    prompt: '"죄송합니다. 지금 자리를 비우고 있습니다. 다시 전화드리겠습니다."를 일본어로 작성해보세요.',
  },
  '히라가나 복습': {
    situation: '기초 학습에서 히라가나 단어를 읽고 짧은 문장으로 말하는 연습입니다.',
    expressions: ['これはあさです。', 'これはいえです。', 'これはねこです。'],
    dialogue: [
      { speaker: '상대방', text: 'これは何ですか。' },
      { speaker: '사용자', text: 'これはねこです。' },
      { speaker: '상대방', text: 'ひらがなで書けますか。' },
      { speaker: '사용자', text: 'はい、ねこです。' },
    ],
    prompt: '"이것은 고양이입니다."를 히라가나 일본어로 작성해보세요.',
  },
  '카페 주문': {
    situation: '카페에서 음료 크기, 포장 여부, 결제 방법을 말하는 상황입니다.',
    expressions: ['アイスコーヒーを一つお願いします。', '持ち帰りでお願いします。', 'カードで払えますか。'],
    dialogue: [
      { speaker: '상대방', text: 'ご注文はお決まりですか。' },
      { speaker: '사용자', text: 'アイスコーヒーを一つお願いします。' },
      { speaker: '상대방', text: '店内でお召し上がりですか。' },
      { speaker: '사용자', text: '持ち帰りでお願いします。' },
    ],
    prompt: '"아이스커피 하나를 포장으로 부탁드립니다."를 일본어로 작성해보세요.',
  },
  '길 묻기': {
    situation: '역 근처에서 목적지까지 가는 길과 소요 시간을 묻는 상황입니다.',
    expressions: ['駅はどこですか。', 'ここから歩いて行けますか。', 'どのくらいかかりますか。'],
    dialogue: [
      { speaker: '사용자', text: 'すみません、駅はどこですか。' },
      { speaker: '상대방', text: 'この道をまっすぐ行ってください。' },
      { speaker: '사용자', text: 'ここから歩いて行けますか。' },
      { speaker: '상대방', text: 'はい、10分くらいです。' },
    ],
    prompt: '"여기서 걸어서 갈 수 있나요? 얼마나 걸리나요?"를 일본어로 작성해보세요.',
  },
  '쇼핑': {
    situation: '옷가게에서 사이즈와 색상을 묻고 입어봐도 되는지 확인하는 상황입니다.',
    expressions: ['この服のMサイズはありますか。', '試着してもいいですか。', '別の色はありますか。'],
    dialogue: [
      { speaker: '사용자', text: 'すみません、この服のMサイズはありますか。' },
      { speaker: '상대방', text: 'はい、ございます。' },
      { speaker: '사용자', text: '試着してもいいですか。' },
      { speaker: '상대방', text: 'はい、試着室はこちらです。' },
    ],
    prompt: '"이 옷 M 사이즈가 있나요? 입어봐도 되나요?"를 일본어로 작성해보세요.',
  },
  '약속 잡기': {
    situation: '친구와 만날 날짜, 시간, 장소를 정중하게 정하는 상황입니다.',
    expressions: ['土曜日は空いていますか。', '午後3時に会いませんか。', '駅の前で待ち合わせしましょう。'],
    dialogue: [
      { speaker: '사용자', text: '土曜日は空いていますか。' },
      { speaker: '상대방', text: 'はい、空いています。' },
      { speaker: '사용자', text: '午後3時に駅の前で会いませんか。' },
      { speaker: '상대방', text: 'いいですね。' },
    ],
    prompt: '"토요일 오후 3시에 역 앞에서 만날까요?"를 일본어로 작성해보세요.',
  },
};

function getFallbackDetail(title: string, modeLabel: string): PracticeDetail {
  return {
    situation: `${modeLabel} 목표에 맞춰 "${title}" 상황에서 바로 쓸 수 있는 문장을 연습합니다.`,
    expressions: [`${title}について勉強したいです。`, '例文を作ってみます。', '自然な表現に直したいです。'],
    dialogue: [
      { speaker: '상대방', text: '今日は何を練習しますか。' },
      { speaker: '사용자', text: `${title}について勉強したいです。` },
      { speaker: '상대방', text: 'では、例文を作ってみましょう。' },
      { speaker: '사용자', text: '自然な表現に直したいです。' },
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
        description="일본 취업, 워킹홀리데이, 일상생활, JLPT 목표에 맞는 학습 콘텐츠를 추천합니다."
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
            <p className="empty-state">추천 학습 콘텐츠가 없습니다.</p>
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
              <ul className="expression-list">
                {selectedDetail.expressions.map((expression) => (
                  <li key={expression}>{expression}</li>
                ))}
              </ul>
            </div>

            <div className="practice-section">
              <h3>예시 대화</h3>
              <div className="dialogue-list">
                {selectedDetail.dialogue.map((line, index) => (
                  <p key={`${line.speaker}-${index}`}>
                    <strong>{line.speaker}</strong>
                    <span>{line.text}</span>
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
