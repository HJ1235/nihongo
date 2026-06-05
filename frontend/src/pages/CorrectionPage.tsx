import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createCorrection, getCorrection, getMyCorrections } from '../api/correctionApi';
import type { CorrectionMode, CorrectionResponse } from '../api/types';
import { Badge, Button, Card, PageHeader } from '../components/ui';

type CorrectionLocationState = {
  initialText?: string;
  mode?: CorrectionMode;
};

const modeOptions: Array<{ label: string; value: CorrectionMode }> = [
  { label: '일반', value: 'GENERAL' },
  { label: '면접', value: 'JOB_INTERVIEW' },
  { label: '워킹홀리데이', value: 'WORKING_HOLIDAY' },
  { label: '일상', value: 'DAILY_LIFE' },
];

const modeLabels: Record<CorrectionMode, string> = {
  GENERAL: '일반',
  JOB_INTERVIEW: '면접',
  WORKING_HOLIDAY: '워킹홀리데이',
  DAILY_LIFE: '일상',
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR');
}

function isCorrectionMode(value: unknown): value is CorrectionMode {
  return value === 'GENERAL' || value === 'JOB_INTERVIEW' || value === 'WORKING_HOLIDAY' || value === 'DAILY_LIFE';
}

function CorrectionPage() {
  const location = useLocation();
  const locationState = location.state as CorrectionLocationState | null;
  const [originalText, setOriginalText] = useState(() => locationState?.initialText ?? '');
  const [mode, setMode] = useState<CorrectionMode>(() =>
    isCorrectionMode(locationState?.mode) ? locationState.mode : 'GENERAL',
  );
  const [corrections, setCorrections] = useState<CorrectionResponse[]>([]);
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedId = selectedCorrection?.id ?? null;
  const canSubmit = useMemo(() => originalText.trim().length > 0 && !submitting, [originalText, submitting]);

  const loadCorrections = () => {
    setLoadingHistory(true);

    getMyCorrections()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '교정 기록을 불러오지 못했습니다.');
        }

        setCorrections(response.data);
        setSelectedCorrection((current) => current ?? response.data[0] ?? null);
      })
      .catch((error) => {
        setErrorMessage(getErrorMessage(error, '교정 기록을 불러오지 못했습니다.'));
        setCorrections([]);
      })
      .finally(() => setLoadingHistory(false));
  };

  useEffect(() => {
    loadCorrections();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createCorrection({
        originalText: originalText.trim(),
        mode,
      });

      if (!response.success) {
        throw new Error(response.message ?? '교정을 요청하지 못했습니다.');
      }

      setSelectedCorrection(response.data);
      setCorrections((current) => [response.data, ...current.filter((item) => item.id !== response.data.id)]);
      setOriginalText('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '교정을 요청하지 못했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectCorrection = async (correctionId: number) => {
    setErrorMessage(null);

    try {
      const response = await getCorrection(correctionId);
      if (!response.success) {
        throw new Error(response.message ?? '교정 상세를 불러오지 못했습니다.');
      }

      setSelectedCorrection(response.data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, '교정 상세를 불러오지 못했습니다.'));
    }
  };

  return (
    <main className="page-layout">
      <PageHeader
        description="문장을 입력하면 자연스러운 일본어 표현과 교정 이유를 확인할 수 있습니다."
        eyebrow="AI Correction"
        title="일본어 AI 교정"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <section className="correction-layout">
        <div className="correction-main">
          <Card className="correction-form-card">
            <form className="correction-form" onSubmit={handleSubmit}>
              <label>
                <span>일본어 문장</span>
                <textarea
                  className="ui-textarea correction-textarea"
                  onChange={(event) => setOriginalText(event.target.value)}
                  placeholder="교정받고 싶은 일본어 문장을 입력하세요."
                  value={originalText}
                />
              </label>

              <label>
                <span>교정 모드</span>
                <select
                  className="ui-select"
                  onChange={(event) => setMode(event.target.value as CorrectionMode)}
                  value={mode}
                >
                  {modeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <Button disabled={!canSubmit} type="submit">
                {submitting ? '교정 중...' : '교정 요청'}
              </Button>
            </form>
          </Card>

          {selectedCorrection ? (
            <Card className="correction-result-card">
              <div className="correction-result-header">
                <Badge>{modeLabels[selectedCorrection.mode]}</Badge>
                <time>{formatDate(selectedCorrection.createdAt)}</time>
              </div>
              <div className="correction-block">
                <span>원문</span>
                <p>{selectedCorrection.originalText}</p>
              </div>
              <div className="correction-block corrected">
                <span>교정문</span>
                <p>{selectedCorrection.correctedText}</p>
              </div>
              <div className="correction-block">
                <span>설명</span>
                <p>{selectedCorrection.explanation}</p>
              </div>
            </Card>
          ) : (
            !loadingHistory && <p className="empty-state">아직 교정 결과가 없습니다.</p>
          )}
        </div>

        <aside className="correction-history">
          <div className="correction-history-header">
            <h2>내 교정 기록</h2>
            <Badge>{corrections.length}개</Badge>
          </div>

          {loadingHistory && <p className="status-text">교정 기록을 불러오는 중입니다...</p>}
          {!loadingHistory && corrections.length === 0 && <p className="empty-state">교정 기록이 없습니다.</p>}

          {!loadingHistory && corrections.length > 0 && (
            <div className="correction-history-list">
              {corrections.map((correction) => (
                <button
                  className={correction.id === selectedId ? 'correction-history-item active' : 'correction-history-item'}
                  key={correction.id}
                  onClick={() => handleSelectCorrection(correction.id)}
                  type="button"
                >
                  <span>{correction.originalText}</span>
                  <small>
                    {modeLabels[correction.mode]} · {formatDate(correction.createdAt)}
                  </small>
                </button>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default CorrectionPage;
