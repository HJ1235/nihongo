import { useEffect, useState } from 'react';
import { getWords } from '../api/wordApi';
import type { WordResponse } from '../api/types';
import { Badge, ButtonLink, Card, PageHeader } from '../components/ui';

function WordsPage() {
  const [words, setWords] = useState<WordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);

    getWords('N5')
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '단어 목록을 불러오지 못했습니다.');
        }

        setWords(response.data);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : '단어 목록을 불러오지 못했습니다.');
        setWords([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-layout">
      <PageHeader
        action={<ButtonLink to="/word-quiz">단어 퀴즈</ButtonLink>}
        description="JLPT N5 핵심 단어를 뜻과 예문으로 확인하세요."
        eyebrow="JLPT N5"
        title="N5 단어 학습"
      />

      {loading && <p className="status-text">단어 목록을 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && !errorMessage && words.length === 0 && <p className="empty-state">표시할 단어 데이터가 없습니다.</p>}

      {!loading && !errorMessage && words.length > 0 && (
        <section className="word-grid">
          {words.map((word) => (
            <Card className="word-card" key={word.id}>
              <div className="word-card-main">
                <Badge>{word.level}</Badge>
                <strong>{word.japanese}</strong>
                <span>{word.reading}</span>
                <p>{word.meaning}</p>
              </div>
              <div className="word-example">
                <p>{word.exampleSentence}</p>
                <small>{word.exampleMeaning}</small>
              </div>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

export default WordsPage;
