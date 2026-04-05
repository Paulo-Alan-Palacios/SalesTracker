import React from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SalesFormPage } from './pages/SalesFormPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AppHeader } from './components/AppHeader';
import { ToastProvider } from './components/Toast';
import { DevToolsPanel } from './components/DevToolsPanel';
import { ThemeProvider } from './context/ThemeContext';
import { useAppSelector } from './store/hooks';

function PrivateRoute({ children }: { children: ReactNode }): React.JSX.Element {
  const token = useAppSelector(s => s.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function ProtectedLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <>
      <AppHeader />
      {children}
      <DevToolsPanel />
    </>
  );
}

function AppRoutes(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout><DashboardPage /></ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ventas/nueva"
          element={
            <PrivateRoute>
              <ProtectedLayout><SalesFormPage /></ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

