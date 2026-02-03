import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link2, Loader2, Search, Trash2, Unlink2 } from "lucide-react";
import type { Pet } from "../../models/pet.model";
import { tutorFacade } from "../../facades/tutor.facade";
import { ConfirmModal } from "../global/modals/ConfirmModal";

type Props = { tutorId: number; onViewPet: (pet: Pet) => void };

export const TutorPetLinker: React.FC<Props> = ({ tutorId, onViewPet }) => {
  const [linked, setLinked] = useState<Pet[]>([]);
  const [available, setAvailable] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");
  const [loadingLinked, setLoadingLinked] = useState(false);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [confirmPet, setConfirmPet] = useState<Pet | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const availTopRef = useRef<HTMLDivElement | null>(null);
  const availBoxRef = useRef<HTMLDivElement | null>(null);
  const [availMinHeight, setAvailMinHeight] = useState<number | undefined>(undefined);

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const linkedIds = useMemo(() => new Set(linked.map((p) => p.id)), [linked]);
  const safeNext = pageCount > 0 ? Math.min(pageCount - 1, page + 1) : 0;

  const scrollToAvailableTop = () => {
    const el = availTopRef.current;
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

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
      setAvailable(resp.content ?? []);
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
      scrollToAvailableTop();
    }, 300);

    return () => window.clearTimeout(t);
  }, [search, linked.length]);

  useEffect(() => {
    if (loadingAvail) {
      const h = availBoxRef.current?.getBoundingClientRect().height;
      if (h && h > 0) setAvailMinHeight(h);
      return;
    }
    setAvailMinHeight(undefined);
  }, [loadingAvail]);

  const link = async (petId: number) => {
    setBusyId(petId);
    try {
      await tutorFacade.vincularPet(tutorId, petId);
      await loadLinked();
    } finally {
      setBusyId(null);
    }
  };

  const goPrev = () => {
    scrollToAvailableTop();
    loadAvailable(search.trim(), Math.max(0, page - 1));
  };

  const goNext = () => {
    scrollToAvailableTop();
    loadAvailable(search.trim(), safeNext);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h4 className="text-xl font-black tracking-tight text-[color:var(--modal-text)]">Vínculos Pet-Tutor</h4>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--modal-muted-2)] mt-1">
            Vincule ou remova pets deste tutor
          </p>
        </div>

        <button
          type="button"
          onClick={loadLinked}
          className="px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition
            bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]
            text-[color:var(--modal-muted)] cursor-pointer
            hover:bg-[color:var(--modal-ghost-hover-bg)] hover:text-[color:var(--modal-text)]"
        >
          Atualizar
        </button>
      </div>

      <div
        ref={availBoxRef}
        className="relative rounded-3xl border border-[color:var(--modal-border)] bg-[color:var(--modal-bg)] p-5"
        style={availMinHeight ? { minHeight: availMinHeight } : undefined}
      >
        <div ref={availTopRef} />

        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-emerald-600" />

          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--modal-muted)]">
            Buscar pet para vincular
          </span>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl border outline-none transition-all font-semibold
            bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]
            text-[color:var(--modal-text)] placeholder:text-[color:var(--modal-muted-2)]
            focus:ring-2 focus:ring-[color:var(--primary)]"
          placeholder="Digite o nome do pet…"
        />

        {loadingAvail ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl backdrop-blur-[2px]">
            <div className="flex items-center gap-2 text-[color:var(--modal-muted)] text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando…
            </div>
          </div>
        ) : null}

        <div className={loadingAvail ? "opacity-60 pointer-events-none select-none" : ""}>
          <div className="mt-4 space-y-2">
            {available.length === 0 ? (
              <div className="text-[11px] font-bold text-[color:var(--modal-muted-2)]">
                Nenhum pet disponível para vincular.
              </div>
            ) : (
              available.map((p) => {
                const isLinked = linkedIds.has(p.id);

                return (
                  <Row key={p.id} pet={p} onView={() => onViewPet(p)}>
                    {isLinked ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
                            bg-[color:var(--modal-ghost-hover-bg)] text-[color:var(--modal-muted)]"
                        >
                          Já vinculado
                        </span>

                        <button
                          type="button"
                          disabled
                          className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
                            bg-[color:var(--primary)] text-white opacity-40 cursor-not-allowed flex items-center gap-2"
                          title="Este pet já está vinculado a este tutor"
                        >
                          <Link2 className="w-4 h-4" />
                          Vincular
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => link(p.id)}
                        disabled={busyId === p.id || loadingAvail}
                        className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition
                          bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]
                          disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {busyId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                        Vincular
                      </button>
                    )}
                  </Row>
                );
              })
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={loadingAvail || page <= 0}
              className="px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition
                bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]
                text-[color:var(--modal-muted)]
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Anterior
            </button>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--modal-muted-2)]">
              Página {page + 1} de {Math.max(pageCount, 1)}
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={loadingAvail || pageCount === 0 || page >= pageCount - 1}
              className="px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition
                bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]
                text-[color:var(--modal-muted)]
                disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[color:var(--modal-border)] bg-[color:var(--modal-bg)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Unlink2 className="w-4 h-4 text-violet-600" />
          
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--modal-muted)]">
            Vínculos atuais
          </span>
        </div>

        {loadingLinked ? (
          <div className="flex items-center gap-2 text-[color:var(--modal-muted)] text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
          </div>
        ) : linked.length === 0 ? (
          <div className="text-[11px] font-bold text-[color:var(--modal-muted-2)]">Nenhum pet vinculado a este tutor.</div>
        ) : (
          <div className="space-y-2">
            {linked.map((p) => (
              <Row key={p.id} pet={p} onView={() => onViewPet(p)}>
                <button
                  type="button"
                  onClick={() => setConfirmPet(p)}
                  disabled={busyId === p.id}
                  className="w-10 h-10 rounded-xl border transition flex items-center justify-center
                    bg-[color:var(--modal-bg)] border-[color:var(--modal-border)]
                    text-[color:var(--modal-muted)] cursor-pointer
                    hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Remover vínculo do pet ${p.nome}`}
                  title="Remover vínculo"
                >
                  {busyId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </Row>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirmPet}
        title="Remover vínculo"
        description={`Deseja desvincular o pet "${confirmPet?.nome}" deste tutor?`}
        confirmText="Desvincular"
        onCancel={() => setConfirmPet(null)}
        onConfirm={async () => {
          if (!confirmPet) return;
          setBusyId(confirmPet.id);
          try {
            await tutorFacade.desvincularPet(tutorId, confirmPet.id);
            await loadLinked();
          } finally {
            setBusyId(null);
            setConfirmPet(null);
          }
        }}
      />
    </div>
  );
};

const Row: React.FC<{ pet: Pet; onView: () => void; children: React.ReactNode }> = ({ pet, onView, children }) => (
  <div
    className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 overflow-hidden
      border-[color:var(--modal-border)] bg-[color:var(--modal-bg)]"
  >
    <button type="button" onClick={onView} className="flex-1 min-w-0 text-left hover:opacity-90">
      <p className="font-black truncate text-[color:var(--modal-text)]">{pet.nome}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest truncate text-[color:var(--modal-muted-2)]">
        {pet.raca || "S.R.D"} • {pet.idade} anos
      </p>
    </button>

    <div className="shrink-0 flex items-center gap-2">{children}</div>
  </div>
);
