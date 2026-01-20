import { InputField } from '../../components/ui/InputField';

export const ForgotPasswordForm = () => (
  <div className="mt-4 space-y-6">
    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm border border-emerald-100">
      Informe o e-mail associado à sua conta para recebermos um link de redefinição de senha.
    </div>
    
    <InputField label="E-mail Cadastrado" type="email" placeholder="exemplo@seplag.mt.gov.br" />

    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-200/50 transition-all active:scale-[0.98]">
      Enviar Link de Recuperação
    </button>
  </div>
);