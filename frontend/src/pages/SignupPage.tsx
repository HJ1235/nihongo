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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '회원가입에 실패했습니다. 입력값을 다시 확인해주세요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-layout premium-auth-layout">
      <section className="premium-auth-shell">
        <aside className="auth-visual-panel signup-panel">
          <Link className="marketing-brand" to="/">
            <img alt="NihonGO" src="/logo.png" />
            <span>NihonGO</span>
          </Link>
          <div>
            <p className="landing-eyebrow">Start learning</p>
            <h2>목표에 맞는 일본어 학습 루틴을 만들어보세요</h2>
          </div>
          <div className="auth-example-card">
            <span>학습 목표</span>
            <strong className="jp-text">日本で働く準備をします。</strong>
            <small>일본에서 일할 준비를 합니다.</small>
          </div>
        </aside>

        <Card className="auth-card premium-auth-card">
          <div className="auth-heading">
            <p className="auth-tagline">NihonGO 계정 만들기</p>
            <h1>나만의 일본어 학습 계정을 만들어보세요</h1>
            <p className="summary">
              진도, 오답노트, AI 교정 기록과 추천 학습을 계정에 안전하게 저장합니다.
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
                autoComplete="new-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                type="password"
                value={password}
              />
            </label>
            <label>
              <span>닉네임</span>
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
      </section>
    </main>
  );
}

export default SignupPage;
