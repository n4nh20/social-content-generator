import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('phoneNumber');
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isAuthenticated() ? <Navigate to="/dashboard/services" replace /> : <LoginPage />
        } />
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
