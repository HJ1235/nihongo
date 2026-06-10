import { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers, getApiErrorMessage } from '../api/adminApi';
import type { AdminStatsResponse } from '../api/types';
import { ButtonLink, Card, PageHeader } from '../components/ui';

function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statsErrorMessage, setStatsErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '관리자 권한을 확인하지 못했습니다.');
        }

        setAuthorized(true);
        setLoadingStats(true);

        return getAdminStats()
          .then((statsResponse) => {
            if (!statsResponse.success) {
              throw new Error(statsResponse.message ?? '관리자 통계를 불러오지 못했습니다.');
            }

            setStats(statsResponse.data);
          })
          .catch((error) => {
            setStatsErrorMessage(getApiErrorMessage(error, '관리자 통계를 불러오지 못했습니다.'));
          })
          .finally(() => setLoadingStats(false));
      })
      .catch((error) => {
        setAuthorized(false);
        setErrorMessage(getApiErrorMessage(error, '관리자 권한이 필요합니다.'));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-layout">
      <PageHeader
        description="서비스 운영 현황을 한눈에 확인합니다."
        eyebrow="Admin"
        title="관리자 대시보드"
      />

      {loading && <p className="status-text">관리자 권한을 확인하는 중입니다...</p>}
      {!loading && errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && authorized && (
        <>
          <section className="admin-stats-grid">
            <Card className="admin-stat-card stat-card-dark">
              <span>전체 회원</span>
              <strong>{stats?.totalUserCount ?? 0}</strong>
            </Card>
            <Card className="admin-stat-card">
              <span>활성 회원</span>
              <strong>{stats?.activeUserCount ?? 0}</strong>
            </Card>
            <Card className="admin-stat-card">
              <span>정지 회원</span>
              <strong>{stats?.suspendedUserCount ?? 0}</strong>
            </Card>
            <Card className="admin-stat-card">
              <span>전체 공지</span>
              <strong>{stats?.noticeCount ?? 0}</strong>
            </Card>
            <Card className="admin-stat-card">
              <span>고정 공지</span>
              <strong>{stats?.pinnedNoticeCount ?? 0}</strong>
            </Card>
            <Card className="admin-stat-card">
              <span>전체 교정</span>
              <strong>{stats?.totalCorrectionCount ?? 0}</strong>
            </Card>
            <Card className="admin-stat-card">
              <span>오늘 교정</span>
              <strong>{stats?.todayCorrectionCount ?? 0}</strong>
            </Card>
          </section>

          {loadingStats && <p className="status-text compact-status">관리자 통계를 불러오는 중입니다...</p>}
          {statsErrorMessage && <p className="status-text compact-status">{statsErrorMessage}</p>}

          <section className="admin-grid">
            <Card className="admin-card">
              <div>
                <h2>공지사항 관리</h2>
                <p>공지 작성, 수정, 삭제와 상단 고정 여부를 관리합니다.</p>
              </div>
              <ButtonLink to="/admin/notices">공지 관리로 이동</ButtonLink>
            </Card>
            <Card className="admin-card">
              <div>
                <h2>회원 관리</h2>
                <p>회원 목록 확인, 정지, 정지 해제를 처리합니다.</p>
              </div>
              <ButtonLink to="/admin/users">회원 관리로 이동</ButtonLink>
            </Card>
          </section>
        </>
      )}
    </main>
  );
}

export default AdminDashboardPage;
