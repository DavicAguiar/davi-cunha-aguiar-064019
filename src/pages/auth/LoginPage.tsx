import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4">
      <section className="max-w-[440px] w-full bg-white rounded-3xl shadow-2xl p-10 border border-emerald-50">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Pet Manager <span className="text-emerald-600 font-medium">SEPLAG</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2 uppercase tracking-wider">
            Acesso Restrito
          </p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-[10px] font-bold border border-red-100 animate-fade-in uppercase">
            {error}
          </div>
        )}

        <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : ''}>
          <LoginForm />
        </div>

        <footer className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Governo do Estado de Mato Grosso
          </p>
        </footer>
      </section>
    </main>
  );
};