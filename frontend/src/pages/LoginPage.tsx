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
      <main className="auth-layout">
        <Card className="auth-card">
          <p className="eyebrow">NihonGO</p>
          <h1>준비 중입니다</h1>
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
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout">
      <Card className="auth-card">
        <div className="auth-heading">
          <img alt="NihonGO" className="auth-logo" src="/logo.png" />
          <p className="auth-tagline">일본어를, 더 가까이.</p>
          <h1>다시 학습을 이어가세요</h1>
          <p className="summary">히라가나와 가타카나를 차분하게 반복하는 일본어 학습 공간입니다.</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
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
            <span>Password</span>
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
          계정이 없나요? <Link to="/signup">회원가입</Link>
        </p>
      </Card>
    </main>
  );
}

export default LoginPage;
