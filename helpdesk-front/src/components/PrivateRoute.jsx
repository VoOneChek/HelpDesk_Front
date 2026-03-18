import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'Admin') return <Navigate to="/admin" replace />;
        if (user.role === 'Operator') return <Navigate to="/operator" replace />;
        return <Navigate to="/client" replace />;
    }

    return children;
}