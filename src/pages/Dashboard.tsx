import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardHome from '../components/DashboardHome';
import PetList from '../components/PetList';
import OwnerList from '../components/OwnerList';
import AppointmentList from '../components/AppointmentList';
import MedicalRecord from '../components/MedicalRecord';
import './Dashboard.css'; 

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/home" element={<DashboardHome />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/owners" element={<OwnerList />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/medical-records" element={<MedicalRecord />} />
          <Route path="*" element={<Navigate to="/dashboard/home" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;