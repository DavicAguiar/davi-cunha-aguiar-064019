import React, { useState } from 'react';
import { authFacade } from '../../facades/auth.facade';
import { InputField } from '../../components/ui/InputField'; 

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authFacade.login(credentials); 
  };

  return (
    <form className="space-y-6 mt-4 animate-fade-in" onSubmit={handleSubmit}>
      <InputField
        label="Usuário"
        type="text"
        id="username"
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        placeholder="Digite seu usuário"
        required
      />
      
      <InputField
        label="Senha"
        type="password"
        id="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="••••••••"
        required
      />

      <button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-200/50 transition-all active:scale-[0.98] mt-4"
      >
        Entrar no Sistema
      </button>
    </form>
  );
};