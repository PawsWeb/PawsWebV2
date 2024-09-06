import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { IsLoggedInContext, UserContext } from '../App';

const ProtectedRoute = ({ element, roles, ...rest }) => {
  const isLoggedIn = useContext(IsLoggedInContext);
  const { userRole } = useContext(UserContext);

  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    // Redirect to home if logged in but role is not authorized
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;