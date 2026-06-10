import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const featureCards = [
  {
    title: 'AI 일본어 교정',
    description: '입력한 문장을 자연스러운 일본어로 다듬고, 한국어 설명으로 교정 이유를 확인합니다.',
  },
  {
    title: '목적별 추천 학습',
    description: '일본 취업, 워킹홀리데이, 일상생활, JLPT 목표에 맞는 상황 표현을 연습합니다.',
  },
  {
    title: '기초부터 JLPT까지',
    description: '히라가나와 가타카나, N5 단어, 퀴즈와 오답 복습으로 학습 흐름을 이어갑니다.',
  },
];

const roadmapItems = ['히라가나', '가타카나', 'N5 어휘', '상황 실습'];

function LandingPage() {
  const { isAuthenticated, status } = useAuth();

  if (status === 'loading') {
    return (
      <main className="marketing-page">
        <section className="landing-hero">
          <p className="landing-eyebrow">NihonGO</p>
          <h1>학습 공간을 준비하고 있습니다</h1>
        </section>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="marketing-page">
      <header className="marketing-nav">
        <Link className="marketing-brand" to="/">
          <img alt="NihonGO" src="/logo.png" />
          <span>NihonGO</span>
        </Link>
        <nav aria-label="Landing navigation">
          <Link to="/login">로그인</Link>
          <Link className="nav-cta" to="/signup">
            시작하기
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">AI Japanese Learning Platform</p>
          <h1>일본에서의 삶과 일을 준비하는 어른의 일본어 학습</h1>
          <p>
            NihonGO는 일본 취업, 워킹홀리데이, JLPT 학습자를 위해 문장 교정과 상황별 실습을
            차분하게 이어주는 AI 기반 일본어 학습 플랫폼입니다.
          </p>
          <div className="landing-actions">
            <Link className="premium-button premium-button-primary" to="/signup">
              무료로 시작하기
            </Link>
            <Link className="premium-button premium-button-secondary" to="/login">
              다시 학습하기
            </Link>
          </div>
        </div>

        <div className="landing-visual" aria-label="Japanese study preview">
          <div className="photo-panel">
            <div className="photo-overlay">
              <span className="jp-text">日本で、自然に話す。</span>
              <small>Speak naturally in real situations.</small>
            </div>
          </div>
          <div className="floating-study-card">
            <span>오늘의 표현</span>
            <strong className="jp-text">転入届の手続きに来ました。</strong>
            <small>전입신고 절차를 하러 왔습니다.</small>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <p className="landing-eyebrow">Designed for focus</p>
          <h2>실제로 쓰는 일본어에 집중합니다</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article className="premium-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section roadmap-section">
        <div className="section-heading">
          <p className="landing-eyebrow">Roadmap</p>
          <h2>기초 문자부터 상황 실습까지 이어지는 흐름</h2>
        </div>
        <div className="roadmap-strip">
          {roadmapItems.map((item, index) => (
            <div className="roadmap-step" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
