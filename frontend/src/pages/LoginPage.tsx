import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button, Card, Input } from '../components/ui';

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, status } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (status === 'loading') {
    return (
      <main className="auth-layout premium-auth-layout">
        <Card className="auth-card premium-auth-card">
          <p className="landing-eyebrow">NihonGO</p>
          <h1>학습 공간을 준비하고 있습니다</h1>
        </Card>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout premium-auth-layout">
      <section className="premium-auth-shell">
        <aside className="auth-visual-panel">
          <Link className="marketing-brand" to="/">
            <img alt="NihonGO" src="/logo.png" />
            <span>NihonGO</span>
          </Link>
          <div>
            <p className="landing-eyebrow">Welcome back</p>
            <h2>오늘도 일본어 감각을 차분히 이어가세요</h2>
          </div>
          <div className="auth-example-card">
            <span>오늘의 문장</span>
            <strong className="jp-text">よろしくお願いいたします。</strong>
            <small>잘 부탁드립니다.</small>
          </div>
        </aside>

        <Card className="auth-card premium-auth-card">
          <div className="auth-heading">
            <p className="auth-tagline">일본 생활과 커리어를 위한 학습 공간</p>
            <h1>다시 학습을 이어가세요</h1>
            <p className="summary">
              레슨, 퀴즈, AI 교정과 추천 실습을 한곳에서 이어갈 수 있습니다.
            </p>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              <span>이메일</span>
              <Input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </label>
            <label>
              <span>비밀번호</span>
              <Input
                autoComplete="current-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                type="password"
                value={password}
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Button disabled={submitting} type="submit">
              {submitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="auth-link">
            아직 계정이 없나요? <Link to="/signup">회원가입</Link>
          </p>
        </Card>
      </section>
    </main>
  );
}

export default LoginPage;
