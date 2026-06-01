import { useEffect, useState } from 'react';
import { getLessons } from '../api/lessonApi';
import type { KanaType, LessonResponse } from '../api/types';
import { Badge, Button, ButtonLink, Card, PageHeader } from '../components/ui';

type LessonFilter = 'ALL' | KanaType;

const filters: Array<{ label: string; value: LessonFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '히라가나', value: 'HIRAGANA' },
  { label: '가타카나', value: 'KATAKANA' },
];

function LessonsPage() {
  const [filter, setFilter] = useState<LessonFilter>('ALL');
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);

    getLessons(filter === 'ALL' ? undefined : filter)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '학습 목록을 불러오지 못했습니다.');
        }

        setLessons(response.data);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : '학습 목록을 불러오지 못했습니다.');
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <main className="page-layout">
      <PageHeader
        action={<ButtonLink to="/quiz">퀴즈 시작</ButtonLink>}
        description="문자와 발음을 카드로 빠르게 훑어보세요."
        eyebrow="Lessons"
        title="학습 목록"
      />

      <section className="filter-row" aria-label="Lesson filters">
        {filters.map((item) => (
          <Button
            className={filter === item.value ? 'active' : undefined}
            key={item.value}
            onClick={() => setFilter(item.value)}
            type="button"
            variant="secondary"
          >
            {item.label}
          </Button>
        ))}
      </section>

      {loading && <p className="status-text">학습 목록을 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && !errorMessage && lessons.length === 0 && <p className="empty-state">학습 데이터가 없습니다.</p>}

      {!loading && !errorMessage && lessons.length > 0 && (
        <section className="lesson-grid">
          {lessons.map((lesson) => (
            <Card className="kana-card" key={lesson.id}>
              <Badge>{lesson.kanaType === 'HIRAGANA' ? 'Hiragana' : 'Katakana'}</Badge>
              <strong>{lesson.character}</strong>
              <p>{lesson.romaji}</p>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

export default LessonsPage;
