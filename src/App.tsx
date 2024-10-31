import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardHome from './components/DashboardHome';
import AuthRoute from './components/AuthRoute';

const App: React.FC = () => {
  return (
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/" element={
          <AuthRoute>
              <Login />
            </AuthRoute>
          } />

        {/* Ruta protegida para el Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRoles={[1, 2]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Página de error */}
        <Route path="/error" element={<ErrorPage />} />

        {/* Ruta para manejar cualquier otra URL no definida */}
        <Route path="*" element={<DashboardHome />} />
      </Routes>
   
  );
};

export default App;
