import  { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { authFacade } from './facades/auth.facade';
import { Header } from './components/global/Header';
import { Footer } from './components/global/Footer';
import { Toast } from './components/global/Toast';

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const HomePage = lazy(() => import('./pages/home/HomePage').then(m => ({ default: m.HomePage })));
const TutorsPage = lazy(() => import('./pages/tutors/TutorsPage').then(m => ({ default: m.TutorsPage })));

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Header />
    <main className="flex-grow">
      <Outlet /> 
    </main>
    <Footer />
  </div>
);

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authFacade.startRefreshTimer();
    }
  }, []);

  return (
    <BrowserRouter>
    <Toast />
    
      <Suspense fallback={ <LoadingFallback /> }>
        <Routes>
          <Route path="/login" element={ <LoginPage /> } />

         {/* Rotas Privadas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/tutores" element={<TutorsPage />} />
              
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const LoadingFallback = () => (
  <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-emerald-800 font-black animate-pulse uppercase tracking-widest text-xs">
        Pet SEPLAG
      </p>
    </div>
  </div>
);

export default App;