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
    expressions: ['袋はご利用ですか。', '2,300円になります。', '200円のお返しです。'],
    dialogue: [
      { speaker: '상대방', text: '合計で2,300円になります。' },
      { speaker: '사용자', text: 'はい。' },
      { speaker: '상대방', text: '袋はご利用ですか。' },
      { speaker: '사용자', text: 'はい、お願いします。' },
      { speaker: '상대방', text: '200円のお返しです。' },
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
      { speaker: '사용자', text: '会社に提出します。' },
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
      { speaker: '사용자', text: 'いつから使えますか。' },
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
  '병원 방문 표현': {
    situation: '처음 방문한 병원 접수에서 보험증을 제시하고 증상을 말하는 상황입니다.',
    expressions: ['初めて来ました。', '保険証を持っています。', '頭が痛いです。'],
    dialogue: [
      { speaker: '상대방', text: '今日はどうされましたか。' },
      { speaker: '사용자', text: '頭が痛いです。' },
      { speaker: '상대방', text: 'こちらの病院は初めてですか。' },
      { speaker: '사용자', text: 'はい、初めて来ました。' },
    ],
    prompt: '"처음 왔습니다. 보험증을 가지고 있습니다. 머리가 아픕니다."를 일본어로 작성해보세요.',
  },
  '집 구하기 표현': {
    situation: '부동산에서 월세, 역까지 거리, 내견 가능 여부를 확인하는 상황입니다.',
    expressions: ['家賃はいくらですか。', '駅からどのくらいですか。', '内見できますか。'],
    dialogue: [
      { speaker: '상대방', text: 'どのようなお部屋をお探しですか。' },
      { speaker: '사용자', text: '駅に近い部屋を探しています。' },
      { speaker: '상대방', text: 'こちらの物件はいかがですか。' },
      { speaker: '사용자', text: '内見できますか。' },
    ],
    prompt: '"역에서 가까운 방을 찾고 있습니다. 내견할 수 있나요?"를 일본어로 작성해보세요.',
  },
};

function getFallbackDetail(title: string, modeLabel: string): PracticeDetail {
  return {
    situation: `${modeLabel} 목표에 맞춰 "${title}" 상황에서 바로 쓸 수 있는 문장을 연습합니다.`,
    expressions: [`${title}について練習したいです。`, '例文を作ってみます。', '自然な表現に直したいです。'],
    dialogue: [
      { speaker: '상대방', text: '今日は何を練習しますか。' },
      { speaker: '사용자', text: `${title}について練習したいです。` },
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
