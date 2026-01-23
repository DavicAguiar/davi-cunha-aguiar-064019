import React, { useEffect, useMemo, useState } from "react";
import { Link2, Loader2, Search, Unlink2 } from "lucide-react";
import type { Pet } from "../../models/pet.model";
import { tutorFacade } from "../../facades/tutor.facade";

type Props = { tutorId: number; onViewPet: (pet: Pet) => void };

export const TutorPetLinker: React.FC<Props> = ({ tutorId, onViewPet }) => {
    const [linked, setLinked] = useState<Pet[]>([]);
    const [available, setAvailable] = useState<Pet[]>([]);
    const [search, setSearch] = useState("");
    const [loadingLinked, setLoadingLinked] = useState(false);
    const [loadingAvail, setLoadingAvail] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const linkedIds = useMemo(() => new Set(linked.map((p) => p.id)), [linked]);

    const loadLinked = async () => {
        setLoadingLinked(true);
        try {
        const data = await tutorFacade.getLinkedPets(tutorId);
        setLinked(data);
        } finally {
        setLoadingLinked(false);
        }
    };

    const loadAvailable = async (q: string, nextPage: number) => {
        setLoadingAvail(true);
        try {
            const resp = await tutorFacade.searchPetsToLink({ nome: q, page: nextPage, size: 5 });
            const list = (resp.content ?? []).filter((p) => !linkedIds.has(p.id));

            setAvailable(list);
            setPage(resp.page ?? nextPage);
            setPageCount(resp.pageCount ?? 0);
        } finally {
            setLoadingAvail(false);
        }
    };

    useEffect(() => {
        loadLinked();
    }, [tutorId]);

    useEffect(() => {
        const t = window.setTimeout(() => {
            setPage(0);
            loadAvailable(search.trim(), 0);
        }, 300);

        return () => window.clearTimeout(t);
    }, [search, linked.length]);

    const link = async (petId: number) => {
        setBusyId(petId);
        try {
            await tutorFacade.vincularPet(tutorId, petId);
            await loadLinked();
        } finally {
            setBusyId(null);
        }
    };

        const unlink = async (petId: number) => {
            setBusyId(petId);
            try {
                await tutorFacade.desvincularPet(tutorId, petId);
                await loadLinked();
            } finally {
                setBusyId(null);
            }
        };

    return (
        <div className="space-y-6">
        <div className="flex items-end justify-between gap-3">
            <div>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">Vínculos Pet–Tutor</h4>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1">
                Vincule ou remova pets deste tutor
            </p>
            </div>

            <button
            type="button"
            onClick={loadLinked}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
            >
            Atualizar
            </button>
        </div>

        <div className="rounded-3xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Buscar pet para vincular</span>
            </div>

            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-700"
            placeholder="Digite o nome do pet…"
            />

            <div className="mt-4 space-y-2">
            {loadingAvail ? (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Loader2 className="w-4 h-4 animate-spin" /> Buscando…
                </div>
            ) : available.length === 0 ? (
                <div className="text-[11px] font-bold text-slate-400">Nenhum pet disponível para vincular.</div>
            ) : (
                available.map((p) => (
                <Row key={p.id} pet={p} onView={() => onViewPet(p)}>
                    <button
                    type="button"
                    onClick={() => link(p.id)}
                    disabled={busyId === p.id}
                    className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                    >
                    {busyId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                    Vincular
                    </button>
                </Row>
                ))
            )}
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => loadAvailable(search.trim(), Math.max(0, page - 1))}
                    disabled={loadingAvail || page <= 0}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-40"
                >
                    Anterior
                </button>

                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Página {page + 1} de {Math.max(pageCount, 1)}
                </span>

                <button
                    type="button"
                    onClick={() => loadAvailable(search.trim(), Math.min(pageCount - 1, page + 1))}
                    disabled={loadingAvail || pageCount === 0 || page >= pageCount - 1}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-40"
                >
                    Próxima
                </button>
            </div>

        </div>

        <div className="rounded-3xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
            <Unlink2 className="w-4 h-4 text-violet-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Vínculos atuais</span>
            </div>

            {loadingLinked ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
            </div>
            ) : linked.length === 0 ? (
            <div className="text-[11px] font-bold text-slate-400">Nenhum pet vinculado a este tutor.</div>
            ) : (
            <div className="space-y-2">
                {linked.map((p) => (
                <Row key={p.id} pet={p} onView={() => onViewPet(p)}>
                    <button
                    type="button"
                    onClick={() => unlink(p.id)}
                    disabled={busyId === p.id}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50 flex items-center gap-2"
                    >
                    {busyId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink2 className="w-4 h-4" />}
                    Remover
                    </button>
                </Row>
                ))}
            </div>
            )}
        </div>
        </div>
    );
};

const Row: React.FC<{ pet: Pet; onView: () => void; children: React.ReactNode }> = ({ pet, onView, children }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 overflow-hidden">
    <button
      type="button"
      onClick={onView}
      className="flex-1 min-w-0 text-left hover:opacity-90"
    >
      <p className="font-black text-slate-800 truncate">{pet.nome}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
        {pet.raca || "S.R.D"} • {pet.idade} anos
      </p>
    </button>

    <div className="shrink-0 flex items-center gap-2">
      {children}
    </div>
  </div>
);
