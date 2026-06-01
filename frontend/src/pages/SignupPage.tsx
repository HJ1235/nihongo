import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';
import { Button, Card, Input } from '../components/ui';

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const response = await signup({ email, password, nickname });

      if (!response.success) {
        throw new Error(response.message ?? '회원가입에 실패했습니다.');
      }

      navigate('/login', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
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
          <h1>새 학습 계정 만들기</h1>
          <p className="summary">짧은 퀴즈와 오답 복습으로 문자를 꾸준히 익혀보세요.</p>
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
              autoComplete="new-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              type="password"
              value={password}
            />
          </label>
          <label>
            <span>Nickname</span>
            <Input
              autoComplete="nickname"
              name="nickname"
              onChange={(event) => setNickname(event.target.value)}
              placeholder="표시 이름"
              type="text"
              value={nickname}
            />
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button disabled={submitting} type="submit">
            {submitting ? '가입 중...' : '회원가입'}
          </Button>
        </form>

        <p className="auth-link">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </Card>
    </main>
  );
}

export default SignupPage;
