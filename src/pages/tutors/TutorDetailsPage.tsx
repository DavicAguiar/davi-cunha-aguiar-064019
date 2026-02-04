import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Pencil, Trash2 } from "lucide-react";

import { tutorService } from "../../services/tutor.service";
import { TutorFormModal } from "../../components/tutors/TutorFormModal";
import { DeleteTutorModal } from "../../components/tutors/DeleteTutorModal";
import { TutorLinkedPetsPreview } from "../../components/tutors/TutorLinkedPetsPreview";

import type { Tutor } from "../../models/tutor.model";
import type { Pet } from "../../models/pet.model";
import { formatCpf } from "../../utils/format";

export const TutorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutorId = useMemo(() => Number(id), [id]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const data: Tutor = await tutorService.getTutorById(tutorId);
        if (!alive) return;

        setTutor(data);
      } catch {
        if (!alive) return;
        setError("Não foi possível carregar o detalhamento do tutor.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    if (Number.isFinite(tutorId)) run();
    else {
      setError("ID inválido.");
      setLoading(false);
    }

    return () => {
      alive = false;
    };
  }, [tutorId]);

  const handleViewPet = (pet: Pet) => {
    // Ajuste se sua rota de pet for diferente
    navigate(`/pets/${pet.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
            Detalhes do <span className="text-emerald-600">Tutor</span>
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
        ) : tutor ? (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-[color:var(--nav-border)] bg-[color:var(--nav-bg-2)] flex items-center justify-center">
                {tutor.foto?.url ? (
                  <img src={tutor.foto.url} alt={tutor.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-emerald-400">
                    <User className="w-20 h-20 stroke-[1.2]" />
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--nav-muted-2)]">
                  Nome do Tutor
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tighter text-[color:var(--nav-text)]">
                  {tutor.nome}
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
              <InfoBlock title="Informações do Tutor" icon={<User className="w-5 h-5" />}>
                <InfoRow label="CPF" value={formatCpf(tutor.cpf)} />
                <InfoRow label="E-mail" value={tutor.email || "—"} />
                <InfoRow label="Telefone" value={tutor.telefone || "—"} />
              </InfoBlock>

              <TutorLinkedPetsPreview
                tutorId={tutor.id}
                showManage={false}
                onViewPet={handleViewPet}
              />
            </div>
          </div>
        ) : null}
      </section>

      <TutorFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        tutorToEdit={tutor}
      />

      <DeleteTutorModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          navigate(-1);
        }}
        tutorToDelete={tutor}
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
