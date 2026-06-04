import { FormEvent, useEffect, useState } from 'react';
import {
  createNotice,
  deleteNotice,
  getAdminNotices,
  getAdminUsers,
  getApiErrorMessage,
  updateNotice,
} from '../api/adminApi';
import type { NoticeResponse } from '../api/types';
import { Badge, Button, Card, Input, PageHeader } from '../components/ui';

type NoticeForm = {
  title: string;
  content: string;
  pinned: boolean;
};

const emptyForm: NoticeForm = {
  title: '',
  content: '',
  pinned: false,
};

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString('ko-KR') : '-';
}

function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [form, setForm] = useState<NoticeForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadNotices = () => {
    setLoading(true);
    setErrorMessage(null);

    getAdminUsers()
      .then((adminResponse) => {
        if (!adminResponse.success) {
          throw new Error(adminResponse.message ?? '관리자 권한이 필요합니다.');
        }

        setAuthorized(true);
        return getAdminNotices();
      })
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '공지사항을 불러오지 못했습니다.');
        }

        setNotices(response.data);
      })
      .catch((error) => {
        setAuthorized(false);
        setErrorMessage(getApiErrorMessage(error, '관리자 권한이 필요합니다.'));
        setNotices([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = editingId ? await updateNotice(editingId, form) : await createNotice(form);
      if (!response.success) {
        throw new Error(response.message ?? '공지사항을 저장하지 못했습니다.');
      }

      resetForm();
      loadNotices();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '공지사항을 저장하지 못했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notice: NoticeResponse) => {
    setEditingId(notice.id);
    setForm({
      title: notice.title,
      content: notice.content,
      pinned: notice.pinned,
    });
  };

  const handleDelete = async (noticeId: number) => {
    setErrorMessage(null);

    try {
      const response = await deleteNotice(noticeId);
      if (!response.success) {
        throw new Error(response.message ?? '공지사항을 삭제하지 못했습니다.');
      }

      if (editingId === noticeId) {
        resetForm();
      }
      loadNotices();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '공지사항을 삭제하지 못했습니다.'));
    }
  };

  return (
    <main className="page-layout">
      <PageHeader
        description="공지사항을 작성하고 상단 고정 여부를 관리합니다."
        eyebrow="Admin"
        title="공지사항 관리"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {authorized && (
        <Card className="admin-form-card">
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              <span>제목</span>
              <Input
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="공지 제목"
                value={form.title}
              />
            </label>
            <label>
              <span>내용</span>
              <textarea
                className="ui-textarea"
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                placeholder="공지 내용"
                value={form.content}
              />
            </label>
            <label className="checkbox-row">
              <input
                checked={form.pinned}
                onChange={(event) => setForm((current) => ({ ...current, pinned: event.target.checked }))}
                type="checkbox"
              />
              <span>상단 고정</span>
            </label>
            <div className="admin-form-actions">
              <Button disabled={submitting} type="submit">
                {editingId ? '공지 수정' : '공지 작성'}
              </Button>
              {editingId && (
                <Button onClick={resetForm} type="button" variant="secondary">
                  취소
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {loading && <p className="status-text">관리자 권한과 공지사항을 확인하는 중입니다...</p>}
      {!loading && authorized && notices.length === 0 && !errorMessage && <p className="empty-state">공지사항이 없습니다.</p>}

      {!loading && authorized && notices.length > 0 && (
        <section className="admin-list">
          {notices.map((notice) => (
            <Card className="admin-list-card" key={notice.id}>
              <div className="admin-list-header">
                <div>
                  <div className="admin-badges">
                    {notice.pinned && <Badge>PINNED</Badge>}
                    <Badge>{notice.createdByNickname}</Badge>
                  </div>
                  <h2>{notice.title}</h2>
                </div>
                <div className="admin-card-actions">
                  <Button onClick={() => handleEdit(notice)} type="button" variant="secondary">
                    수정
                  </Button>
                  <Button onClick={() => handleDelete(notice.id)} type="button" variant="danger">
                    삭제
                  </Button>
                </div>
              </div>
              <p>{notice.content}</p>
              <small>
                생성: {formatDate(notice.createdAt)} / 수정: {formatDate(notice.updatedAt)}
              </small>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminNoticesPage;
