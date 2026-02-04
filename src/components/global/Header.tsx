import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Moon, Sun, User, Menu, X } from "lucide-react";
import { authFacade } from "../../facades/auth.facade";
import logoIcon from "../../assets/img/logo_icon.svg";
import { themeActions, themeState$ } from "../../state/theme.state";

// Adicionei 'cursor-pointer' aqui para garantir que todos os links tenham a mãozinha
const linkBase = "px-4 py-3 md:py-2 rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center cursor-pointer";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${linkBase} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100
      dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-900/40`
    : `${linkBase} text-[var(--nav-muted)] hover:text-emerald-700 hover:bg-emerald-50
      dark:hover:text-emerald-200 dark:hover:bg-emerald-900/20`;

export const Header: React.FC = () => {
  const [mode, setMode] = useState(themeState$.getValue().mode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sub = themeState$.subscribe((s) => setMode(s.mode));
    return () => sub.unsubscribe();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="px-6 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50
      bg-[color:var(--nav-bg)]/80 backdrop-blur-md border-b border-[color:var(--nav-border)]
      text-[color:var(--nav-text)]
      shadow-sm"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white flex items-center justify-center shrink-0">
            <img src={logoIcon} alt="Pet" className="h-6 w-6" draggable={false} />
          </div>

          <div className="block">
            <h1 className="text-lg md:text-xl font-black tracking-tighter leading-none flex items-center gap-2">
              PET
              <span
                className="bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] px-2 py-0.5 rounded-md uppercase
                  tracking-widest font-bold dark:bg-emerald-900/40 dark:text-emerald-200"
              >
                SEPLAG
              </span>
            </h1>

            <p className="text-[8px] md:text-[9px] font-bold text-[color:var(--nav-muted-2)] uppercase tracking-[0.3em] mt-1.5">
              Governo do Estado de MT
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/pets" className={linkClass}>
            Pets
          </NavLink>

          <NavLink to="/tutores" className={linkClass}>
            Tutores
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[color:var(--nav-muted)] hover:text-[color:var(--nav-text)] transition-colors cursor-pointer"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-[color:var(--nav-border)]">
            <div className="text-right">
              <p className="text-[10px] font-black text-[color:var(--nav-text)] uppercase leading-none">
                Analista de TI
              </p>
              
              <p className="text-[9px] font-bold text-[color:var(--nav-muted-2)] uppercase tracking-tighter mt-1">
                Sênior - SEPLAG/MT
              </p>
            </div>

            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 text-[color:var(--nav-muted)] dark:bg-white/10 dark:text-[color:var(--nav-muted)]">
              <User size={20} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => themeActions.toggle()}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest
              border border-[color:var(--nav-border)] text-[color:var(--nav-muted)]
              hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200
              dark:hover:bg-emerald-900/25 dark:hover:text-emerald-200 dark:hover:border-emerald-900/40
              transition-all active:scale-95 cursor-pointer"
          >
            {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{mode === "dark" ? "Claro" : "Escuro"}</span>
          </button>

          <button
            onClick={() => authFacade.logout()}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black
              text-[color:var(--nav-muted)]
              hover:bg-red-50 hover:text-red-700
              dark:hover:bg-red-900/20 dark:hover:text-white
              transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/40 active:scale-95 cursor-pointer"
          >
            <span className="uppercase tracking-[0.2em]">Sair</span>

            <div className="bg-black/5 text-[color:var(--nav-muted)] dark:bg-white/10 dark:text-[color:var(--nav-muted)] group-hover:bg-red-600 group-hover:text-white p-1.5 rounded-lg transition-colors">
              <LogOut size={16} />
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="absolute top-full left-0 w-full p-6 flex flex-col gap-4 shadow-2xl md:hidden animate-in slide-in-from-top-2 duration-200 border-b border-[color:var(--nav-border)]"
          style={{ backgroundColor: "var(--nav-bg)" }} 
        >
          
          <div className="flex flex-col gap-2">
            <NavLink to="/pets" className={linkClass} onClick={closeMenu}>
              Pets
            </NavLink>

            <NavLink to="/tutores" className={linkClass} onClick={closeMenu}>
              Tutores
            </NavLink>
          </div>

          <hr className="border-[color:var(--nav-border)]" />

          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 text-[color:var(--nav-muted)] dark:bg-white/10 dark:text-[color:var(--nav-muted)] shrink-0">
              <User size={20} />
            </div>

            <div>
              <p className="text-[10px] font-black text-[color:var(--nav-text)] uppercase leading-none">
                Analista de TI
              </p>

              <p className="text-[9px] font-bold text-[color:var(--nav-muted-2)] uppercase tracking-tighter mt-1">
                Sênior - SEPLAG/MT
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => themeActions.toggle()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest
                border border-[color:var(--nav-border)] text-[color:var(--nav-text)]
                bg-[color:var(--nav-bg-2)] cursor-pointer"
            >
              {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {mode === "dark" ? "Claro" : "Escuro"}
            </button>

            <button
              onClick={() => authFacade.logout()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest
                bg-red-600 text-white hover:bg-red-700
                transition-all cursor-pointer shadow-sm"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};