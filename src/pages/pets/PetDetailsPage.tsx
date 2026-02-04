import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PawPrint, User, Pencil, Trash2, Dog } from "lucide-react";
import { petService } from "../../services/pet.service";
import { PetFormModal } from "../../components/pets/PetFormModal";
import { DeletePetModal } from "../../components/pets/DeletePetModal";

import type { Pet } from "../../models/pet.model";
import type { TutorSummary } from "../../models/tutor.model";

type PetDetails = Pet & {
  especie?: string;
  tutores?: TutorSummary[];
};

export const PetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const petId = useMemo(() => Number(id), [id]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [tutores, setTutores] = useState<TutorSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchPetData = useCallback(async () => {
    if (!Number.isFinite(petId)) {
      setError("ID inválido.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const petData: PetDetails = await petService.getPetById(petId);

      setPet(petData);
      setTutores(Array.isArray(petData.tutores) ? petData.tutores : []);
    } catch (e) {
      setError("Não foi possível carregar o detalhamento do pet.");
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchPetData();
  }, [fetchPetData]);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
            Detalhes do <span className="text-emerald-600">Pet</span>
          </h2>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mt-2 text-[color:var(--nav-muted)]">
            Secretaria de Estado de Planejamento e Gestão (SEPLAG)
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
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

      <section className="rounded-[3rem] border border-[color:var(--nav-border)] bg-[color:var(--nav-bg)] overflow-hidden" aria-busy={loading}>
        {loading ? (
          <div className="p-14 flex items-center gap-4">
            <div className="w-10 h-10 border-4 rounded-full animate-spin"
              style={{
                borderColor: "color-mix(in srgb, var(--nav-border) 55%, transparent)",
                borderTopColor: "var(--primary)",
              }}
              aria-label="Carregando"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
              Carregando detalhamento...
            </p>
          </div>
        ) : error ? (
          <div className="p-14">
            <p className="text-xs font-black uppercase tracking-widest text-red-500">{error}</p>
          </div>
        ) : pet ? (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-[color:var(--nav-border)] bg-[color:var(--nav-bg-2)]">
                {pet.foto?.url ? (
                  <img src={pet.foto.url} alt={pet.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-400">
                    <Dog className="w-20 h-20 stroke-[1.2]" />
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
                  Nome do Pet
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
                  {pet.nome}
                </h1>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(true)}
                    className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
                      bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]
                      transition active:scale-95 cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
                      flex items-center justify-center gap-2"
                  >
                    <Pencil size={16} strokeWidth={3} />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(true)}
                    className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
                      bg-red-600 text-white hover:bg-red-700
                      transition active:scale-95 cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40
                      flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <InfoBlock title="Informações do Pet" icon={<PawPrint className="w-5 h-5" />}>
                <InfoRow label="Nome" value={pet.nome || "—"} />
                <InfoRow label="Raça" value={pet.raca || "S.R.D"} />
                <InfoRow label="Idade" value={`${pet.idade} anos`} />
              </InfoBlock>

              <InfoBlock title="Tutor" icon={<User className="w-5 h-5" />}>
                {tutores.length > 0 ? (
                    <div className="space-y-3">
                        {tutores.map((t) => (
                        <div
                            key={t.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/tutores/${t.id}`)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") navigate(`/tutores/${t.id}`);
                            }}
                            className="rounded-2xl border border-[color:var(--nav-border)] bg-[color:var(--nav-bg-2)] p-5
                              cursor-pointer transition
                              hover:border-emerald-300 hover:bg-[color:var(--nav-bg)]
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                        >
                            <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
                              Tutor vinculado
                            </div>

                            <div className="mt-2 font-black text-lg tracking-tight text-[color:var(--nav-text)]">
                              {t.nome}
                            </div>

                            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-[color:var(--nav-muted)]">
                              Contato:{" "}
                              <span className="text-emerald-600 font-black">
                                {t.telefone || t.email || "—"}
                              </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="rounded-2xl border border-[color:var(--nav-border)] bg-[color:var(--nav-bg-2)] p-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
                        Este pet não possui tutor vinculado.
                      </p>
                    </div>
                    )}
              </InfoBlock>
            </div>
          </div>
        ) : null}
      </section>

      <PetFormModal
        isOpen={isEditOpen}
        onClose={async () => {
          setIsEditOpen(false);
          fetchPetData();
        }}
        petToEdit={pet}
      />

      <DeletePetModal
        isOpen={isDeleteOpen}
        onClose={async () => {
          setIsDeleteOpen(false);

          try {
            await petService.getPetById(petId);
          } catch {
            navigate(-1); 
          }
        }}
        petToDelete={pet}
      />
    </div>
  );
};

const InfoBlock: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <div className="rounded-[2rem] border border-[color:var(--nav-border)] bg-[color:var(--nav-bg)] p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-[color:var(--nav-border)] bg-[color:var(--nav-bg-2)] text-[color:var(--primary)]">
        {icon}
      </div>
      <h3 className="text-lg font-black tracking-tight text-[color:var(--nav-text)]">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-[color:var(--nav-border)] bg-[color:var(--nav-bg-2)] px-4 py-3">
    <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
      {label}
    </div>
    <div className="font-semibold text-[color:var(--nav-text)] break-words">{value}</div>
  </div>
);
