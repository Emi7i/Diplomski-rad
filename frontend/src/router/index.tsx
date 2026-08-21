import { createBrowserRouter, Navigate } from 'react-router';
import DashboardPage from '@pages/DashboardPage';
import RootLayout from '@components/layout/RootLayout';
import LoginPage from "@pages/LoginPage.tsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);
