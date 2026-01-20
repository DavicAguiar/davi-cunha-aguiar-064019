import  { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
// Descomente conforme criar os arquivos:
// const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
// const PetsPage = lazy(() => import('./pages/pets/PetsPage')); 

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            {/* <Route path="/pets" element={<PetsPage />} /> */}
            <Route path="/" element={<Navigate to="/login" replace />} />
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
        Pet Manager SEPLAG
      </p>
    </div>
  </div>
);

export default App;