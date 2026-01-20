import { authFacade } from '../../facades/auth.facade';
import { InputField } from '../../components/ui/InputField'; 

export const LoginForm = () => (
  <form className="space-y-6 mt-4" onSubmit={(e) => e.preventDefault()}>
    <InputField
      label="E-mail Corporativo"
      type="email"
      id="email"
      placeholder="seunome@seplag.mt.gov.br"
      autoComplete="email"
      required
    />
    
    <div>
      <InputField
        label="Senha"
        type="password"
        id="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />
      <div className="flex justify-end mt-2">
        <button 
          type="button" 
          onClick={() => authFacade.setView('FORGOT_PASSWORD')} 
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          Esqueceu a senha?
        </button>
      </div>
    </div>

    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-200/50 transition-all active:scale-[0.98] text-lg tracking-wide">
      Entrar no Sistema
    </button>
  </form>
);