import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
            Secretaria de Estado de Planejamento e Gestão
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 Governo de Mato Grosso
          </p>
        </div>
        
        <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Termos de Uso</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Suporte</span>
        </div>
      </div>
    </footer>
  );
};