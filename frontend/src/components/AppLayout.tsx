import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from './ui';

type AppLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { label: '대시보드', to: '/dashboard' },
  { label: '학습', to: '/lessons' },
  { label: 'N5 단어', to: '/words' },
  { label: '퀴즈', to: '/quiz' },
  { label: '진행률', to: '/progress' },
  { label: '오답노트', to: '/wrong-notes' },
  { label: '관리자', to: '/admin' },
];

function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="brand-link" to="/dashboard">
          <img alt="NihonGO" className="brand-logo" src="/logo.png" />
          <span className="brand-copy">
            <span>NihonGO</span>
            <small>Japanese study</small>
          </span>
        </NavLink>
        <nav className="app-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="user-menu">
          <span>{user?.nickname || user?.email}</span>
          <Button onClick={handleLogout} type="button" variant="secondary">
            로그아웃
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}

export default AppLayout;
