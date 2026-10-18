import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AuthPage } from './pages/AuthPage';
import { IntroSplash } from './components/common/IntroSplash';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
            <IntroSplash />
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/architecture" element={<ArchitecturePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
