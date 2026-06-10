import { useCallback, useEffect, useState } from 'react';
import { deleteWrongNote, getWrongNotes } from '../api/wrongNoteApi';
import type { WrongNoteResponse } from '../api/types';
import { Badge, Button, ButtonLink, Card, PageHeader } from '../components/ui';

function WrongNotesPage() {
  const [wrongNotes, setWrongNotes] = useState<WrongNoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWrongNotes = useCallback(() => {
    setLoading(true);
    setErrorMessage(null);

    getWrongNotes()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '오답노트를 불러오지 못했습니다.');
        }

        setWrongNotes(response.data);
      })
      .catch((error) => {
        setWrongNotes([]);
        setErrorMessage(error instanceof Error ? error.message : '오답노트를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadWrongNotes();
  }, [loadWrongNotes]);

  const handleDelete = async (lessonId: number) => {
    setDeletingLessonId(lessonId);
    setErrorMessage(null);

    try {
      const response = await deleteWrongNote(lessonId);

      if (!response.success) {
        throw new Error(response.message ?? '오답노트를 삭제하지 못했습니다.');
      }

      await loadWrongNotes();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '오답노트를 삭제하지 못했습니다.');
    } finally {
      setDeletingLessonId(null);
    }
  };

  return (
    <main className="page-layout">
      <PageHeader
        action={<ButtonLink to="/quiz/review">복습 퀴즈 시작</ButtonLink>}
        description="자주 틀린 문자를 모아 다시 확인하고 복습합니다."
        eyebrow="Review"
        title="오답노트"
      />

      {loading && <p className="status-text">오답노트를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && !errorMessage && wrongNotes.length === 0 && <p className="empty-state">현재 오답노트가 비어 있습니다.</p>}

      {!loading && wrongNotes.length > 0 && (
        <section className="wrong-note-grid">
          {wrongNotes.map((note) => (
            <Card className="wrong-note-card" key={note.lessonId}>
              <div>
                <Badge>{note.kanaType === 'HIRAGANA' ? 'Hiragana' : 'Katakana'}</Badge>
                <strong>{note.character}</strong>
                <p>{note.romaji}</p>
              </div>
              <dl className="wrong-note-meta">
                <div>
                  <dt>오답 횟수</dt>
                  <dd>{note.wrongCount}</dd>
                </div>
                <div>
                  <dt>최근 오답</dt>
                  <dd>{new Date(note.lastWrongAt).toLocaleString('ko-KR')}</dd>
                </div>
              </dl>
              <Button
                disabled={deletingLessonId === note.lessonId}
                onClick={() => handleDelete(note.lessonId)}
                type="button"
                variant="secondary"
              >
                {deletingLessonId === note.lessonId ? '삭제 중...' : '삭제'}
              </Button>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

export default WrongNotesPage;
