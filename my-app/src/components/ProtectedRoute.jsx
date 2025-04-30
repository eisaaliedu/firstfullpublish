import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/shared.css';

export function ProtectedRoute({ children, allowedRoles = ['user', 'admin'] }) {
  const { session, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
} 