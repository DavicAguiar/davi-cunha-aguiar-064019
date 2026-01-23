import React from 'react';
import { NavLink } from 'react-router-dom';
import { authFacade } from '../../facades/auth.facade';
import { LogOut, User } from 'lucide-react';
import logoIcon from '../../assets/img/logo_icon.svg';

const linkBase ='px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive? `${linkBase} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100`
    : `${linkBase} text-slate-400 hover:text-emerald-600 hover:bg-emerald-50`;

export const Header: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-100 flex items-center justify-center">
            <img src={logoIcon} alt="Pet" className="h-6 w-6" draggable={false} />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none flex items-center gap-2">
              PET
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md uppercase tracking-widest font-bold">
                SEPLAG
              </span>
            </h1>

            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">
              Governo do Estado de Mato Grosso
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/home" className={linkClass}>
            Pets
          </NavLink>

          <NavLink to="/tutores" className={linkClass}>
            Tutores
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 pr-6 border-r border-slate-100">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Analista de TI</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
              Sênior - SEPLAG/MT
            </p>
          </div>

          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <User size={20} />
          </div>
        </div>

        <button
          onClick={() => authFacade.logout()}
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 active:scale-95"
          aria-label="Encerrar sessão"
        >
          <span className="uppercase tracking-[0.2em]">Sair do Sistema</span>
          <div className="bg-slate-100 group-hover:bg-red-600 group-hover:text-white p-1.5 rounded-lg transition-colors">
            <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </nav>
  );
};