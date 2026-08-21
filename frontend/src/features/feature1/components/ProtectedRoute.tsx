// ProtectedRoute guards authenticated routes.
// It checks localStorage for an auth token.
// If the token is missing, the user is redirected to the login page.
// If the token exists, the requested child route (Outlet) is rendered.
//
// This file is currently disabled (code commented out) while authentication is not in use.

// import { Navigate, Outlet } from 'react-router';
// import { config } from '../../config';
//
// export default function ProtectedRoute() {
//   const token = localStorage.getItem(config.auth.tokenKey);
//
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//
//   return <Outlet />;
// }
