import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Box sx={{ minHeight: '100vh' }}>
        <AppRoutes />
      </Box>
    </AuthProvider>
  );
};

export default App; 