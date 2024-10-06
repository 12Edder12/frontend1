import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/DashboardVet';
import AssistantDashboard from './components/DashboardAssistant';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import ErrorPage from './pages/ErrorPage';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute requiredRole={1}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/assistant"
          element={
            <PrivateRoute requiredRole={2}>
              <AssistantDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
  );
};

export default App;
