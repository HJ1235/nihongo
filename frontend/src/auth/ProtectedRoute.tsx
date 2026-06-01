import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, status } = useAuth();

  if (status === 'loading') {
    return (
      <main className="app-shell">
        <section className="panel panel-narrow">
          <p className="eyebrow">Nihongo</p>
          <h1>Loading</h1>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
