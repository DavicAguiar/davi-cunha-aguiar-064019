import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authFacade } from '../../facades/auth.facade';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';

export const LoginPage: React.FC = () => {
  const { currentView, error, loading } = useAuth();

  const renderForm = () => {
    switch (currentView) {
      case 'REGISTER':
        return <RegisterForm />;
      case 'FORGOT_PASSWORD':
        return <ForgotPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  const getHeaderInfo = () => {
    switch (currentView) {
      case 'REGISTER': return { title: 'Crie sua conta', subtitle: 'Junte-se à rede de proteção animal' };
      case 'FORGOT_PASSWORD': return { title: 'Recuperar acesso', subtitle: 'Enviaremos instruções para seu e-mail' };
      default: return { title: 'Acesse o Sistema', subtitle: 'Gestão de Pets e Tutores - SEPLAG' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      <section className="max-w-[480px] w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-200/50 border border-white overflow-hidden transition-all duration-500 hover:shadow-emerald-300/40 relative">
        
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-100 overflow-hidden">
            <div className="h-full bg-emerald-600 animate-pulse w-full origin-left"></div>
          </div>
        )}

        <div className="p-8 sm:p-12">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-gradient-to-tr from-emerald-500 to-violet-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path d="M19 5.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zM14 10.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zM5 18c0-1.657 2.239-3 5-3s5 1.343 5 3-5 3-5-3zM14 18c0-1.657 2.239-3 5-3s5 1.343 5 3-5 3-5-3z" />
                  <path d="M5 6.5a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              {title}
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              {subtitle}
            </p>
          </header>

          {error && (
            <div role="alert" className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl flex items-center animate-fade-in">
              <span className="text-red-500 text-lg mr-3">✕</span>
              <span className="text-red-800 text-sm font-semibold">{error}</span>
            </div>
          )}

          <div className={`transition-all duration-300 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            {renderForm()}
          </div>

          <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
            {currentView === 'LOGIN' ? (
              <p className="text-slate-600 text-sm font-medium">
                Não possui conta no sistema? {' '}
                <button 
                  onClick={() => authFacade.setView('REGISTER')}
                  className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline underline-offset-4 transition-all"
                >
                  Solicitar Cadastro
                </button>
              </p>
            ) : (
              <button 
                onClick={() => authFacade.setView('LOGIN')}
                className="inline-flex items-center text-sm text-slate-500 font-bold hover:text-emerald-600 transition-colors group"
              >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Voltar para o Login
              </button>
            )}
          </footer>
        </div>
      </section>

      <footer className="fixed bottom-6 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
        Governo de Mato Grosso | SEPLAG | {new Date().getFullYear()} [cite: 320]
      </footer>
    </main>
  );
};