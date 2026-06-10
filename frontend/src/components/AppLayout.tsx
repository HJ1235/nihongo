import type { ReactNode } from 'react';
import { BookOpen, Brain, Home, LogOut, NotebookPen, RotateCcw, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from './ui';

type AppLayoutProps = {
  children: ReactNode;
};

const mainNavItems = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Learn', to: '/lessons', icon: BookOpen },
  { label: 'Review', to: '/wrong-notes', icon: RotateCcw },
  { label: 'JLPT', to: '/words', icon: Brain },
  { label: 'Profile', to: '/progress', icon: UserRound },
];

const desktopNavItems = [
  ...mainNavItems,
  { label: 'Quiz', to: '/quiz', icon: NotebookPen },
  { label: 'AI 교정', to: '/corrections', icon: Brain },
  { label: '추천 학습', to: '/recommendations', icon: BookOpen },
  { label: '관리자', to: '/admin', icon: UserRound },
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
            <small>Premium Japanese learning</small>
          </span>
        </NavLink>

        <nav className="app-nav desktop-nav" aria-label="Main navigation">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                key={item.to}
                to={item.to}
              >
                <Icon aria-hidden="true" size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="user-menu">
          <span>{user?.nickname || user?.email}</span>
          <Button aria-label="로그아웃" onClick={handleLogout} type="button" variant="secondary">
            <LogOut aria-hidden="true" size={16} />
            <span>로그아웃</span>
          </Button>
        </div>
      </header>

      {children}

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              className={({ isActive }) => (isActive ? 'bottom-nav-link active' : 'bottom-nav-link')}
              key={item.to}
              to={item.to}
            >
              <Icon aria-hidden="true" size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default AppLayout;
