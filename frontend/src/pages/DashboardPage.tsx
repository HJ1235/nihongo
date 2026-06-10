import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Brain, NotebookPen, Sparkles } from 'lucide-react';
import { getDashboard } from '../api/dashboardApi';
import type { DashboardResponse } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { ButtonLink, Card, PageHeader } from '../components/ui';

function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '대시보드를 불러오지 못했습니다.');
        }

        setDashboard(response.data);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : '대시보드를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const remainingLessons = useMemo(() => {
    if (!dashboard) {
      return 0;
    }

    return Math.max(dashboard.totalLessons - dashboard.completedLessons, 0);
  }, [dashboard]);

  return (
    <main className="page-layout">
      <PageHeader
        description="오늘의 학습 흐름과 다음에 이어갈 일본어 루틴을 한눈에 확인합니다."
        eyebrow="Home"
        title={`${user?.nickname || '학습자'}님, 오늘도 차분히 이어가요`}
      />

      {loading && <p className="status-text">대시보드를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {dashboard && (
        <>
          <section className="dashboard-hero-card ui-card">
            <div>
              <p className="eyebrow">Today&apos;s Focus</p>
              <h2>기초 문자와 실전 표현을 균형 있게 학습하세요</h2>
              <p>
                전체 {dashboard.totalLessons}개 학습 중 {dashboard.completedLessons}개를 완료했습니다.
                남은 학습은 {remainingLessons}개입니다.
              </p>
            </div>
            <div className="progress-track" aria-label="오늘의 학습 진행률">
              <div className="progress-fill" style={{ width: `${dashboard.progressPercent}%` }} />
            </div>
          </section>

          <section className="stats-grid">
            <Card className="stat-card stat-card-dark">
              <span>전체 진행률</span>
              <strong>{dashboard.progressPercent}%</strong>
            </Card>
            <Card className="stat-card">
              <span>완료한 학습</span>
              <strong>{dashboard.completedLessons}</strong>
            </Card>
            <Card className="stat-card">
              <span>남은 학습</span>
              <strong>{remainingLessons}</strong>
            </Card>
          </section>

          <section className="quick-actions">
            <ButtonLink to="/lessons">
              <BookOpen aria-hidden="true" size={18} />
              문자 학습
            </ButtonLink>
            <ButtonLink to="/recommendations" variant="secondary">
              <Sparkles aria-hidden="true" size={18} />
              추천 학습
            </ButtonLink>
            <ButtonLink to="/corrections" variant="secondary">
              <Brain aria-hidden="true" size={18} />
              AI 교정
            </ButtonLink>
            <ButtonLink to="/quiz" variant="secondary">
              <NotebookPen aria-hidden="true" size={18} />
              퀴즈 시작
            </ButtonLink>
          </section>
        </>
      )}
    </main>
  );
}

export default DashboardPage;
