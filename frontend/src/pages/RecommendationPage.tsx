import { useEffect, useMemo, useState } from 'react';
import { getLearningMode, getRecommendations, updateLearningMode } from '../api/recommendationApi';
import type { LearningMode, ModeRecommendationResponse } from '../api/types';
import { Badge, Button, Card, PageHeader } from '../components/ui';

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

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function RecommendationPage() {
  const [learningMode, setLearningMode] = useState<LearningMode>('GENERAL');
  const [recommendations, setRecommendations] = useState<ModeRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingMode, setUpdatingMode] = useState<LearningMode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeModeLabel = useMemo(
    () => learningModeOptions.find((option) => option.value === learningMode)?.label ?? '일반',
    [learningMode],
  );

  const loadRecommendations = async () => {
    const response = await getRecommendations();

    if (!response.success) {
      throw new Error(response.message ?? '추천 학습 콘텐츠를 불러오지 못했습니다.');
    }

    setRecommendations(response.data);
    setLearningMode(response.data.learningMode);
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
      await loadRecommendations();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '학습 모드를 변경하지 못했습니다.'));
    } finally {
      setUpdatingMode(null);
    }
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
                  <Card className="recommendation-card" key={recommendation}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{recommendation}</strong>
                    <p>{activeModeLabel} 목표에 맞춰 바로 연습하기 좋은 학습 주제입니다.</p>
                  </Card>
                ))}
              </div>
            </>
          )}

          {!loading && !recommendations && !errorMessage && (
            <p className="empty-state">추천 학습 콘텐츠가 없습니다.</p>
          )}
        </section>
      </section>
    </main>
  );
}

export default RecommendationPage;
