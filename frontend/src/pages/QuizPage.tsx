import { useCallback, useEffect, useState } from 'react';
import { answerQuiz, getRandomQuiz, getReviewRandomQuiz } from '../api/quizApi';
import type { QuizAnswerResponse, QuizQuestionResponse } from '../api/types';
import { Badge, Button, ButtonLink, Card, PageHeader } from '../components/ui';

type QuizPageProps = {
  mode?: 'random' | 'review';
};

function QuizPage({ mode = 'random' }: QuizPageProps) {
  const [question, setQuestion] = useState<QuizQuestionResponse | null>(null);
  const [result, setResult] = useState<QuizAnswerResponse | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isReviewMode = mode === 'review';

  const loadQuestion = useCallback(() => {
    setLoading(true);
    setSubmitting(false);
    setResult(null);
    setSelectedAnswer(null);
    setErrorMessage(null);

    const request = isReviewMode ? getReviewRandomQuiz() : getRandomQuiz();

    request
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message ?? '퀴즈를 불러오지 못했습니다.');
        }

        setQuestion(response.data);
      })
      .catch((error) => {
        setQuestion(null);
        setErrorMessage(error instanceof Error ? error.message : '퀴즈를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [isReviewMode]);

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
      const response = await answerQuiz({
        lessonId: question.lessonId,
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
        description={isReviewMode ? '오답노트에 남은 문자를 다시 확인합니다.' : '문자를 보고 알맞은 로마자를 선택하세요.'}
        eyebrow={isReviewMode ? 'Review Quiz' : 'Quiz'}
        title={isReviewMode ? '복습 퀴즈' : '랜덤 퀴즈'}
      />

      {loading && <p className="status-text">퀴즈를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!loading && question && (
        <section className="quiz-panel">
          <Card className="quiz-question">
            <Badge>{question.kanaType === 'HIRAGANA' ? 'Hiragana' : 'Katakana'}</Badge>
            <strong>{question.character}</strong>
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
              <p>학습 완료 처리: {result.progressCompleted ? '완료' : '미완료'}</p>
              <p>오답노트 해결: {result.wrongNoteResolved ? '해결됨' : '해당 없음'}</p>
              {!result.correct && (
                <ButtonLink className="result-link" to="/wrong-notes" variant="secondary">
                  오답노트 보기
                </ButtonLink>
              )}
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

export default QuizPage;
