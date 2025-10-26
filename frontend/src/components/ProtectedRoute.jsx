import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute now supports an optional `requiredRole` prop.
// Example: <ProtectedRoute requiredRole="ADMIN">... </ProtectedRoute>
export default function ProtectedRoute({ children, requiredRole }) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return <Navigate to="/login" />;

    if (requiredRole) {
        const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        if (!role || role.toUpperCase() !== requiredRole.toUpperCase()) {
            // If role doesn't match, redirect to dashboard
            return <Navigate to="/dashboard" />;
        }
    }

    return children;
}