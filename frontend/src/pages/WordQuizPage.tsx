import { useCallback, useEffect, useState } from 'react';
import { answerWordQuiz, getRandomWordQuiz } from '../api/wordQuizApi';
import type { WordQuizAnswerResponse, WordQuizQuestionResponse } from '../api/types';
import { Badge, Button, Card, PageHeader } from '../components/ui';

function WordQuizPage() {
  const [question, setQuestion] = useState<WordQuizQuestionResponse | null>(null);
  const [result, setResult] = useState<WordQuizAnswerResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadQuestion = useCallback(() => {
    setLoading(true);
    setSubmitting(false);
    setResult(null);
    setSelectedAnswer(null);
    setErrorMessage(null);

    getRandomWordQuiz('N5')
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '단어 퀴즈를 불러오지 못했습니다.');
        }

        setQuestion(response.data);
      })
      .catch((error) => {
        setQuestion(null);
        setErrorMessage(error instanceof Error ? error.message : '단어 퀴즈를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  const handleAnswer = async (answer: string) => {
    if (!question || result || submitting) {
      return;
    }

    setSelectedAnswer(answer);
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await answerWordQuiz({
        wordId: question.wordId,
        answer,
      });

      if (!response.success) {
        throw new Error(response.message ?? '답안을 제출하지 못했습니다.');
      }

      setResult(response.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '답안을 제출하지 못했습니다.');
      setSelectedAnswer(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-layout">
      <PageHeader
        description="일본어 단어와 읽는 법을 보고 알맞은 뜻을 고르세요."
        eyebrow="Word Quiz"
        title="N5 단어 퀴즈"
      />

      {loading && <p className="status-text">단어 퀴즈를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && question && (
        <section className="quiz-panel">
          <Card className="word-quiz-question">
            <Badge>{question.level}</Badge>
            <strong>{question.japanese}</strong>
            <p>{question.reading}</p>
          </Card>

          <div className="choice-grid">
            {question.choices.map((choice) => (
              <Button
                className={selectedAnswer === choice ? 'selected' : undefined}
                disabled={Boolean(result) || submitting}
                key={choice}
                onClick={() => handleAnswer(choice)}
                type="button"
                variant="secondary"
              >
                {choice}
              </Button>
            ))}
          </div>

          {result && (
            <Card className={result.correct ? 'result-panel correct' : 'result-panel incorrect'}>
              <h2>{result.correct ? '정답입니다' : '오답입니다'}</h2>
              <p>정답: {result.correctAnswer}</p>
            </Card>
          )}

          <div className="page-actions">
            <Button onClick={loadQuestion} type="button">
              다음 문제
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}

export default WordQuizPage;
