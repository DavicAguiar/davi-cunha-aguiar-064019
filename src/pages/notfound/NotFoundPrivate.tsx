import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PawPrint, Users, ArrowLeft, Compass } from "lucide-react";

export const NotFoundPrivate: React.FC = () => {
  const location = useLocation();

    return (
        <div className="max-w-7xl mx-auto px-8 pt-10">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
                        Navegação
                    </h2>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] mt-2 text-[color:var(--nav-muted)]">
                        Secretaria de Estado de Planejamento e Gestão (SEPLAG)
                    </p>
                </div>

                <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest
                    bg-[color:var(--nav-bg)] text-[color:var(--nav-text)]
                    border border-[color:var(--nav-border)]
                    hover:bg-[color:var(--nav-bg-2)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
                    active:scale-95 transition flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft size={18} strokeWidth={3} />
                    Voltar
                </button>
            </header>

            <section className="py-20 text-center border-2 border-dashed rounded-[3rem]
                border-[color:var(--nav-border)] bg-[color:var(--nav-bg)]">
                <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center
                    border border-[color:var(--nav-border)]
                    bg-[color:var(--nav-bg-2)]">
                    <Compass className="text-[color:var(--primary)]" strokeWidth={2.5} />
                </div>

                <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
                    Erro 404
                </p>

                <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
                    Página não encontrada
                </h1>

                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[color:var(--nav-muted)] px-6">
                    Não existe rota para <span className="text-[color:var(--primary)]">{location.pathname}</span>
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                    <Link to="/pets"
                        className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest
                            bg-[color:var(--primary)] text-white
                            hover:bg-[color:var(--primary-hover)]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
                            active:scale-95 transition flex items-center gap-2"
                    >
                        <PawPrint size={18} strokeWidth={3} />
                        Ir para Pets
                    </Link>

                    <Link to="/tutores"
                        className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest
                            border border-[color:var(--nav-border)]
                            bg-[color:var(--nav-bg)] text-[color:var(--nav-text)]
                            hover:bg-[color:var(--nav-bg-2)]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
                            active:scale-95 transition flex items-center gap-2"
                    >
                        <Users size={18} strokeWidth={3} />
                        Ir para Tutores
                    </Link>
                </div>
            </section>
        </div>
    );
};
