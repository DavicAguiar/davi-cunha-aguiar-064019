import { InputField } from '../../components/ui/InputField';

export const RegisterForm = () => (
  <form className="space-y-5 mt-2" onSubmit={(e) => e.preventDefault()}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Nome Completo" type="text" placeholder="João da Silva" required />
      <InputField label="CPF" type="text" placeholder="000.000.000-00" required />
    </div>
    
    <InputField label="E-mail Institucional" type="email" placeholder="joao@seplag.mt.gov.br" required />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <InputField label="Senha" type="password" placeholder="••••••••" required />
       <InputField label="Confirmar Senha" type="password" placeholder="••••••••" required />
    </div>

    <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98] mt-4">
      Solicitar Cadastro
    </button>
     <p className="text-xs text-slate-500 text-center px-4">
       Ao se cadastrar, você concorda com os termos de uso do sistema governamental.
    </p>
  </form>
);