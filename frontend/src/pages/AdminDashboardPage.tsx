import { useEffect, useState } from 'react';
import { getAdminUsers, getApiErrorMessage } from '../api/adminApi';
import { ButtonLink, Card, PageHeader } from '../components/ui';

function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '관리자 권한을 확인하지 못했습니다.');
        }

        setAuthorized(true);
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
        description="공지사항과 회원 상태를 관리합니다."
        eyebrow="Admin"
        title="관리자 대시보드"
      />

      {loading && <p className="status-text">관리자 권한을 확인하는 중입니다...</p>}
      {!loading && errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && authorized && (
        <section className="admin-grid">
          <Card className="admin-card">
            <div>
              <h2>공지사항 관리</h2>
              <p>공지 작성, 수정, 삭제와 상단 고정을 관리합니다.</p>
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
      )}
    </main>
  );
}

export default AdminDashboardPage;
