import { useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboardApi';
import { getProgress } from '../api/progressApi';
import type { DashboardResponse, ProgressResponse } from '../api/types';
import { Badge, Card, PageHeader } from '../components/ui';

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function ProgressPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [completedLessons, setCompletedLessons] = useState<ProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);

    Promise.all([getDashboard(), getProgress()])
      .then(([dashboardResponse, progressResponse]) => {
        if (!dashboardResponse.success) {
          throw new Error(dashboardResponse.message ?? '진행률 정보를 불러오지 못했습니다.');
        }
        if (!progressResponse.success) {
          throw new Error(progressResponse.message ?? '완료한 학습 목록을 불러오지 못했습니다.');
        }

        setDashboard(dashboardResponse.data);
        setCompletedLessons(progressResponse.data);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : '진행률 정보를 불러오지 못했습니다.');
        setDashboard(null);
        setCompletedLessons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-layout">
      <PageHeader
        description="완료한 문자와 남은 분량을 조용히 확인합니다."
        eyebrow="Progress"
        title="학습 진행률"
      />

      {loading && <p className="status-text">진행률 정보를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {dashboard && (
        <>
          <Card className="progress-summary">
            <div className="progress-copy">
              <span>전체 진행률</span>
              <strong>{dashboard.progressPercent}%</strong>
              <p>
                {dashboard.completedLessons} / {dashboard.totalLessons} lessons completed
              </p>
            </div>
            <div className="progress-track" aria-label="Learning progress">
              <div className="progress-fill" style={{ width: `${dashboard.progressPercent}%` }} />
            </div>
          </Card>

          <section className="stats-grid">
            <Card className="stat-card">
              <span>히라가나 완료</span>
              <strong>{dashboard.hiraganaCompleted}</strong>
            </Card>
            <Card className="stat-card">
              <span>가타카나 완료</span>
              <strong>{dashboard.katakanaCompleted}</strong>
            </Card>
            <Card className="stat-card">
              <span>남은 학습</span>
              <strong>{Math.max(dashboard.totalLessons - dashboard.completedLessons, 0)}</strong>
            </Card>
          </section>
        </>
      )}

      {!loading && !errorMessage && completedLessons.length === 0 && <p className="empty-state">아직 완료한 학습이 없습니다.</p>}

      {!loading && completedLessons.length > 0 && (
        <section className="completed-grid">
          {completedLessons.map((lesson) => (
            <Card className="kana-card completed-card" key={lesson.lessonId}>
              <Badge>{lesson.kanaType === 'HIRAGANA' ? 'Hiragana' : 'Katakana'}</Badge>
              <strong>{lesson.character}</strong>
              <p>{lesson.romaji}</p>
              <time>{formatDate(lesson.completedAt)}</time>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

export default ProgressPage;
