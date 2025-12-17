import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if user exists (simple auth check)
    // In a real app, you might want to validate the token with the backend
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
