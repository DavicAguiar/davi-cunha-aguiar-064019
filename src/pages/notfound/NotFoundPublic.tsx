import React from "react";
import { Link } from "react-router-dom";
import { TriangleAlert, LogIn } from "lucide-react";

export const NotFoundPublic: React.FC = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4">
            <section className="max-w-[520px] w-full bg-white rounded-3xl shadow-2xl p-10 border border-emerald-50">
                <header className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
                        <TriangleAlert className="text-emerald-700" strokeWidth={2.5} />
                    </div>

                    <h1 className="mt-6 text-2xl font-black text-slate-800 uppercase tracking-tight">
                        Página não encontrada
                    </h1>

                    <p className="text-slate-500 font-medium text-sm mt-2 uppercase tracking-wider">
                        Erro <span className="text-emerald-600 font-black">404</span> • Pet Manager SEPLAG
                    </p>
                </header>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 leading-relaxed">
                        O endereço acessado não existe ou foi movido. Você pode voltar para a tela de login.
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-center">
                    <Link to="/login" className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest
                        bg-emerald-600 text-white hover:bg-emerald-700
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40
                        active:scale-95 transition flex items-center gap-2"
                    >
                        <LogIn size={18} strokeWidth={3} />
                        Ir para Login
                    </Link>
                </div>

                <footer className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Governo do Estado de Mato Grosso
                    </p>
                </footer>
            </section>
        </main>
    );
};
