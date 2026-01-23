import React from "react";
import { Mail, Phone } from "lucide-react";

export const SupportContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-slate-800">
        Informações de contatos.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          Canais de atendimento
        </h3>

        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
              <Mail size={18} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">E-mail</p>
              <p className="text-sm text-slate-700">davicunhap2@gmail.com</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mt-1">
                Resposta em até 1 dia útil
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-100">
              <Phone size={18} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">Telefone</p>
              <p className="text-sm text-slate-700">(65) 0000-0000</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mt-1">
                Seg–Sex • 08:00–18:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
