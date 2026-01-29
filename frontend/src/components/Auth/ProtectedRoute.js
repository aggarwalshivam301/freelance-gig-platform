import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <div className="card">
          <h2>⛔ Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p>This page is for <strong>{requireRole}s</strong> only.</p>
          <p>Your role: <strong>{user?.role}</strong></p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
