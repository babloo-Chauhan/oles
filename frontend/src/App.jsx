import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminResults from './pages/AdminResults.jsx';
import Exam from './pages/Exam.jsx';
import Result from './pages/Result.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  return (
    <>


      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin/results" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Layout>
              <AdminResults />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exam/:id" element={
          <ProtectedRoute>
            <Layout>
              <Exam />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <Layout>
              <Result />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}