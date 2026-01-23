import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { authFacade } from "../../facades/auth.facade";
import logoIcon from "../../assets/img/logo_icon.svg";
import { themeActions, themeState$ } from "../../state/theme.state";

const linkBase = "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${linkBase} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100
      dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-900/40`
    : `${linkBase} text-[var(--nav-muted)] hover:text-emerald-700 hover:bg-emerald-50
      dark:hover:text-emerald-200 dark:hover:bg-emerald-900/20`;

export const Header: React.FC = () => {
  const [mode, setMode] = useState(themeState$.getValue().mode);

  useEffect(() => {
    const sub = themeState$.subscribe((s) => setMode(s.mode));
    return () => sub.unsubscribe();
  }, []);

  return (
    <nav className="px-8 py-4 flex justify-between items-center sticky top-0 z-50
        bg-[var(--nav-bg)] border-b border-[var(--nav-border)]
        text-[var(--nav-text)]
        backdrop-blur-[2px] dark:backdrop-blur-md
        shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:shadow-none"
      >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white flex items-center justify-center">
            <img src={logoIcon} alt="Pet" className="h-6 w-6" draggable={false} />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter leading-none flex items-center gap-2">
              PET
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md uppercase
               tracking-widest font-bold dark:bg-emerald-900/40 dark:text-emerald-200">
                SEPLAG
              </span>
            </h1>

            <p className="text-[9px] font-bold text-[var(--nav-muted-2)] uppercase tracking-[0.3em] mt-1.5">
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
        <div className="hidden md:flex items-center gap-3 pr-6 border-r border-[var(--nav-border)]">
          <div className="text-right">
            <p className="text-[10px] font-black text-[var(--nav-text)] uppercase leading-none">
              Analista de TI
            </p>

            <p className="text-[9px] font-bold text-[var(--nav-muted-2)] uppercase tracking-tighter mt-1">
              Sênior - SEPLAG/MT
            </p>
          </div>

          <div className="w-10 h-10 rounded-full flex items-center justify-center
             bg-black/5 text-[var(--nav-muted)] dark:bg-white/10 dark:text-[var(--nav-muted)]">
            <User size={20} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => themeActions.toggle()}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest
            border border-[var(--nav-border)] text-[var(--nav-muted)]
            hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200
            dark:hover:bg-emerald-900/25 dark:hover:text-emerald-200 dark:hover:border-emerald-900/40
              transition-all active:scale-95 enabled:cursor-pointer disabled:cursor-not-allowed"
          aria-label="Alternar tema"
          title={mode === "dark" ? "Tema escuro (clique para claro)" : "Tema claro (clique para escuro)"}
        >
          {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden sm:inline">{mode === "dark" ? "Claro" : "Escuro"}</span>
        </button>

        <button
          onClick={() => authFacade.logout()}
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black
            text-[var(--nav-muted)]
            hover:bg-red-50 hover:text-red-700
            dark:hover:bg-red-900/20 dark:hover:text-white
            transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/40 active:scale-95
            enabled:cursor-pointer disabled:cursor-not-allowed"
          aria-label="Encerrar sessão"
        >
          <span className="uppercase tracking-[0.2em]">
            Sair do Sistema
          </span>

          <div className="bg-black/5 text-[var(--nav-muted)]
              dark:bg-white/10 dark:text-[var(--nav-muted)]
              group-hover:bg-red-600 group-hover:text-white
              p-1.5 rounded-lg transition-colors"
          >
            <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </nav>
  );
};
