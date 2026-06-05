import { useEffect, useState } from 'react';
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

  return (
    <main className="page-layout">
      <PageHeader
        description="오늘의 학습 현황과 바로 이어갈 수 있는 활동을 확인하세요."
        eyebrow="Dashboard"
        title={user?.nickname || user?.email || '내 학습 현황'}
      />

      {loading && <p className="status-text">대시보드를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {dashboard && (
        <>
          <section className="stats-grid">
            <Card className="stat-card">
              <span>전체 학습</span>
              <strong>{dashboard.totalLessons}</strong>
            </Card>
            <Card className="stat-card">
              <span>완료</span>
              <strong>{dashboard.completedLessons}</strong>
            </Card>
            <Card className="stat-card stat-card-dark">
              <span>진행률</span>
              <strong>{dashboard.progressPercent}%</strong>
            </Card>
          </section>

          <section className="quick-actions">
            <ButtonLink to="/lessons">학습 목록</ButtonLink>
            <ButtonLink to="/words" variant="secondary">
              N5 단어 학습
            </ButtonLink>
            <ButtonLink to="/quiz" variant="secondary">
              퀴즈 시작
            </ButtonLink>
            <ButtonLink to="/recommendations" variant="secondary">
              추천 학습
            </ButtonLink>
            <ButtonLink to="/corrections" variant="secondary">
              AI 교정
            </ButtonLink>
            <ButtonLink to="/wrong-notes" variant="secondary">
              오답노트
            </ButtonLink>
          </section>
        </>
      )}
    </main>
  );
}

export default DashboardPage;
