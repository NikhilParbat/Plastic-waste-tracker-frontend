import { Navigate } from 'react-router-dom';
import { useAuth } from '../authContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/submit" />;
  
  return children;
};

