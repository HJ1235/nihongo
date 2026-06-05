import { FormEvent, useEffect, useState } from 'react';
import { activateUser, getAdminUsers, getApiErrorMessage, suspendUser } from '../api/adminApi';
import type { AdminUserResponse } from '../api/types';
import { Badge, Button, Card, Input, PageHeader } from '../components/ui';

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString('ko-KR') : '-';
}

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(null);
  const [reason, setReason] = useState('');
  const [suspendUntil, setSuspendUntil] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingUserId, setSubmittingUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    setErrorMessage(null);

    getAdminUsers()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '회원 목록을 불러오지 못했습니다.');
        }

        setUsers(response.data);
        setSelectedUser((current) => {
          if (!current) {
            return response.data[0] ?? null;
          }
          return response.data.find((user) => user.id === current.id) ?? response.data[0] ?? null;
        });
      })
      .catch((error) => {
        setUsers([]);
        setSelectedUser(null);
        setErrorMessage(getApiErrorMessage(error, '회원 목록을 불러오지 못했습니다.'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSuspend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser) {
      return;
    }

    setSubmittingUserId(selectedUser.id);
    setErrorMessage(null);

    try {
      const response = await suspendUser(selectedUser.id, {
        reason,
        suspendUntil: suspendUntil ? new Date(suspendUntil).toISOString() : null,
      });

      if (!response.success) {
        throw new Error(response.message ?? '회원을 정지하지 못했습니다.');
      }

      setReason('');
      setSuspendUntil('');
      loadUsers();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '회원을 정지하지 못했습니다.'));
    } finally {
      setSubmittingUserId(null);
    }
  };

  const handleActivate = async (userId: number) => {
    setSubmittingUserId(userId);
    setErrorMessage(null);

    try {
      const response = await activateUser(userId);
      if (!response.success) {
        throw new Error(response.message ?? '정지를 해제하지 못했습니다.');
      }

      loadUsers();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '정지를 해제하지 못했습니다.'));
    } finally {
      setSubmittingUserId(null);
    }
  };

  return (
    <main className="page-layout">
      <PageHeader
        description="회원 상태를 확인하고 정지 또는 정지 해제를 처리합니다."
        eyebrow="Admin"
        title="회원 관리"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p className="status-text">회원 목록을 불러오는 중입니다...</p>}

      {!loading && users.length === 0 && !errorMessage && <p className="empty-state">등록된 회원이 없습니다.</p>}

      {!loading && users.length > 0 && (
        <section className="admin-users-layout">
          <Card className="admin-user-list">
            {users.map((user) => (
              <button
                className={selectedUser?.id === user.id ? 'admin-user-row active' : 'admin-user-row'}
                key={user.id}
                onClick={() => setSelectedUser(user)}
                type="button"
              >
                <span>
                  <strong>{user.nickname}</strong>
                  <small>{user.email}</small>
                </span>
                <Badge>{user.status}</Badge>
              </button>
            ))}
          </Card>

          {selectedUser && (
            <Card className="admin-user-detail">
              <div className="admin-list-header">
                <div>
                  <div className="admin-badges">
                    <Badge>{selectedUser.role}</Badge>
                    <Badge>{selectedUser.status}</Badge>
                  </div>
                  <h2>{selectedUser.nickname}</h2>
                  <p>{selectedUser.email}</p>
                </div>
                {selectedUser.status === 'SUSPENDED' && (
                  <Button
                    disabled={submittingUserId === selectedUser.id}
                    onClick={() => handleActivate(selectedUser.id)}
                    type="button"
                    variant="secondary"
                  >
                    정지 해제
                  </Button>
                )}
              </div>

              <dl className="admin-meta">
                <div>
                  <dt>ID</dt>
                  <dd>{selectedUser.id}</dd>
                </div>
                <div>
                  <dt>가입일</dt>
                  <dd>{formatDate(selectedUser.createdAt)}</dd>
                </div>
                <div>
                  <dt>수정일</dt>
                  <dd>{formatDate(selectedUser.updatedAt)}</dd>
                </div>
                <div>
                  <dt>정지 사유</dt>
                  <dd>{selectedUser.suspendReason ?? '-'}</dd>
                </div>
                <div>
                  <dt>정지 종료</dt>
                  <dd>{formatDate(selectedUser.suspendUntil)}</dd>
                </div>
              </dl>

              <form className="admin-form suspend-form" onSubmit={handleSuspend}>
                <label>
                  <span>정지 사유</span>
                  <Input onChange={(event) => setReason(event.target.value)} placeholder="정지 사유" value={reason} />
                </label>
                <label>
                  <span>정지 기간</span>
                  <Input
                    onChange={(event) => setSuspendUntil(event.target.value)}
                    type="datetime-local"
                    value={suspendUntil}
                  />
                </label>
                <Button disabled={submittingUserId === selectedUser.id} type="submit" variant="danger">
                  회원 정지
                </Button>
              </form>
            </Card>
          )}
        </section>
      )}
    </main>
  );
}

export default AdminUsersPage;
