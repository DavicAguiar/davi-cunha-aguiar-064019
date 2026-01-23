import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, X, CheckCircle, Save, Loader2 } from "lucide-react";

import type { Tutor } from "../../models/tutor.model";
import type { Pet } from "../../models/pet.model";

import { tutorFacade } from "../../facades/tutor.facade";
import { TutorPetLinker } from "./TutorPetLinker";
import { TutorLinkedPetsPreview } from "./TutorLinkedPetsPreview";
import { FormField } from "../form/FormField";
import { PetInfoModal } from "../home/PetInfoModal";

interface TutorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorToEdit?: Tutor | null;
}

type TutorForm = { nome: string; email: string; telefone: string; endereco: string; cpf: string };
type Field = keyof TutorForm;

export const TutorFormModal: React.FC<TutorFormModalProps> = ({ isOpen, onClose, tutorToEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_NOME = 100;
  const MAX_EMAIL = 150;
  const MAX_TEL = 20;
  const MAX_END = 200;

  const [tab, setTab] = useState<"dados" | "pets">("dados");

  const [petToView, setPetToView] = useState<Pet | null>(null);
  const [isPetInfoOpen, setIsPetInfoOpen] = useState(false);

  const [form, setForm] = useState<TutorForm>({ nome: "", email: "", telefone: "", endereco: "", cpf: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const normalizeText = (v: string) => v.replace(/\s+/g, " ").trim();
  const onlyDigits = (v: string) => v.replace(/\D/g, "");
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const canManagePets = Boolean(tutorToEdit?.id);

  const modalTitle = useMemo(() => (tutorToEdit ? "Atualizar Tutor" : "Registrar Tutor"), [tutorToEdit]);

  const openPet = useCallback((pet: Pet) => {
    setPetToView(pet);
    setIsPetInfoOpen(true);
  }, []);

  const closePetInfo = useCallback(() => {
    setIsPetInfoOpen(false);
    setPetToView(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (tutorToEdit) {
      setForm({
        nome: tutorToEdit.nome ?? "",
        email: tutorToEdit.email ?? "",
        telefone: tutorToEdit.telefone ?? "",
        endereco: tutorToEdit.endereco ?? "",
        cpf: tutorToEdit.cpf?.toString() ?? "",
      });
      setPreviewUrl(tutorToEdit.foto?.url || "");
      setTab("dados");
    } else {
      setForm({ nome: "", email: "", telefone: "", endereco: "", cpf: "" });
      setPreviewUrl("");
      setTab("dados");
    }

    setSelectedFile(null);
    setErrors({});
    setTouched({});
  }, [isOpen, tutorToEdit]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateField = (field: Field, value: string) => {
    const v = value;

    switch (field) {
      case "nome": {
        const n = normalizeText(v);
        if (!n) return "Nome é obrigatório";
        if (n.length > MAX_NOME) return `Nome deve ter no máximo ${MAX_NOME} caracteres`;
        return "";
      }
      case "email": {
        const e = normalizeText(v);
        if (!e) return "E-mail é obrigatório";
        if (e.length > MAX_EMAIL) return `E-mail deve ter no máximo ${MAX_EMAIL} caracteres`;
        if (!isValidEmail(e)) return "E-mail inválido";
        return "";
      }
      case "telefone": {
        const raw = normalizeText(v);
        if (!raw) return "Telefone é obrigatório";
        if (raw.length > MAX_TEL) return `Telefone deve ter no máximo ${MAX_TEL} caracteres`;
        if (onlyDigits(raw).length < 10) return "Telefone incompleto";
        return "";
      }
      case "endereco": {
        const a = normalizeText(v);
        if (!a) return "Endereço é obrigatório";
        if (a.length > MAX_END) return `Endereço deve ter no máximo ${MAX_END} caracteres`;
        return "";
      }
      case "cpf": {
        const d = onlyDigits(v);
        if (!d) return "CPF é obrigatório";
        if (d.length !== 11) return "CPF deve conter 11 dígitos";
        return "";
      }
      default:
        return "";
    }
  };

  const setField = (field: Field, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const msg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: msg }));
    }
  };

  const blurField = (field: Field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const msg = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const validateAll = () => {
    const next: Partial<Record<Field, string>> = {};
    (Object.keys(form) as Field[]).forEach((f) => {
      const msg = validateField(f, form[f]);
      if (msg) next[f] = msg;
    });

    setErrors(next);
    setTouched({ nome: true, email: true, telefone: true, endereco: true, cpf: true });

    return Object.keys(next).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Arquivo muito grande (Máx 3MB)");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await tutorFacade.saveTutor(
        {
          nome: normalizeText(form.nome),
          email: normalizeText(form.email),
          telefone: normalizeText(form.telefone),
          endereco: normalizeText(form.endereco),
          cpf: Number(onlyDigits(form.cpf)),
        },
        selectedFile,
        tutorToEdit?.id
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-6 sm:px-8 py-5 border-b border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-red-500 transition-colors"
            aria-label="Fechar modal"
          >
            <X size={26} strokeWidth={1} />
          </button>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter leading-none">
            {modalTitle} <span className="text-emerald-600">•</span>{" "}
            <span className="text-slate-400 text-xs sm:text-sm font-black uppercase tracking-[0.25em] ml-2">SEPLAG</span>
          </h3>

          {/* Tabs (somente tabs aqui) */}
          <div className="mt-4 flex items-center gap-2">
            <TabButton active={tab === "dados"} onClick={() => setTab("dados")}>
              Dados
            </TabButton>

            <TabButton
              active={tab === "pets"}
              onClick={() => setTab("pets")}
              disabled={!canManagePets}
              title={!canManagePets ? "Salve o tutor primeiro para gerenciar vínculos" : undefined}
            >
              Pets vinculados
            </TabButton>
          </div>
        </div>

        {/* Corpo */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] flex-1 overflow-hidden">
          {/* Foto */}
          <aside className="bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 p-5">
            <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer flex flex-col items-center gap-4">
              <div className="w-36 h-36 rounded-full bg-white border-2 border-dashed border-slate-200 shadow-inner overflow-hidden flex items-center justify-center group-hover:border-emerald-500 transition-all">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Preview" />
                ) : (
                  <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                    <Camera size={44} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                {previewUrl ? "Trocar foto" : "Adicionar foto"}
              </button>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                JPG/PNG/WEBP • Máx 3MB
              </p>

              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>
          </aside>

          {/* Conteúdo */}
          <section className="overflow-y-auto">
            {tab === "dados" ? (
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                  <div className="sm:col-span-2">
                    <FormField label="Nome" id="tutor-nome" used={form.nome.length} max={MAX_NOME} touched={!!touched.nome} error={errors.nome}>
                      <input
                        id="tutor-nome"
                        maxLength={MAX_NOME}
                        aria-invalid={!!errors.nome}
                        className={inputClass(!!errors.nome)}
                        value={form.nome}
                        onChange={(e) => setField("nome", e.target.value)}
                        onBlur={() => blurField("nome")}
                        placeholder="Ex: Maria Silva"
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField label="E-mail" id="tutor-email" used={form.email.length} max={MAX_EMAIL} touched={!!touched.email} error={errors.email}>
                      <input
                        id="tutor-email"
                        maxLength={MAX_EMAIL}
                        aria-invalid={!!errors.email}
                        className={inputClass(!!errors.email, "violet")}
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        onBlur={() => blurField("email")}
                        placeholder="exemplo@dominio.com"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label="Telefone"
                      id="tutor-tel"
                      used={form.telefone.length}
                      max={MAX_TEL}
                      touched={!!touched.telefone}
                      error={errors.telefone}
                    >
                      <input
                        id="tutor-tel"
                        maxLength={MAX_TEL}
                        aria-invalid={!!errors.telefone}
                        className={inputClass(!!errors.telefone)}
                        value={form.telefone}
                        onChange={(e) => setField("telefone", e.target.value)}
                        onBlur={() => blurField("telefone")}
                        placeholder="(65) 99999-9999"
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField label="CPF" id="tutor-cpf" used={onlyDigits(form.cpf).length} max={11} touched={!!touched.cpf} error={errors.cpf}>
                      <input
                        id="tutor-cpf"
                        maxLength={11}
                        aria-invalid={!!errors.cpf}
                        className={`${inputClass(!!errors.cpf)} font-mono font-bold`}
                        value={onlyDigits(form.cpf)}
                        onChange={(e) => setField("cpf", onlyDigits(e.target.value))}
                        onBlur={() => blurField("cpf")}
                        placeholder="Somente dígitos"
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Endereço"
                      id="tutor-end"
                      used={form.endereco.length}
                      max={MAX_END}
                      touched={!!touched.endereco}
                      error={errors.endereco}
                    >
                      <input
                        id="tutor-end"
                        maxLength={MAX_END}
                        aria-invalid={!!errors.endereco}
                        className={inputClass(!!errors.endereco)}
                        value={form.endereco}
                        onChange={(e) => setField("endereco", e.target.value)}
                        onBlur={() => blurField("endereco")}
                        placeholder="Rua, número, bairro, cidade"
                      />
                    </FormField>
                  </div>

                  {/* Preview de vínculos (fica em Dados, não no header) */}
                  {tutorToEdit?.id ? (
                    <div className="sm:col-span-2">
                      <TutorLinkedPetsPreview
                        tutorId={tutorToEdit.id}
                        onManageClick={() => setTab("pets")}
                        onViewPet={openPet}
                      />
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:col-span-2 py-5 bg-violet-600 text-white rounded-[1.6rem] font-black text-[10px] uppercase tracking-[0.35em] shadow-2xl shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : tutorToEdit ? <Save size={18} /> : <CheckCircle size={18} />}
                    {isSubmitting ? "Sincronizando..." : tutorToEdit ? "Salvar alterações" : "Efetivar cadastro"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                {tutorToEdit?.id ? <TutorPetLinker tutorId={tutorToEdit.id} onViewPet={openPet} /> : null}
              </div>
            )}

            <PetInfoModal isOpen={isPetInfoOpen} pet={petToView} onClose={closePetInfo} />
          </section>
        </div>
      </div>
    </div>
  );
};

function inputClass(hasError: boolean, accent: "emerald" | "violet" = "emerald") {
  const ring = accent === "violet" ? "focus:ring-violet-500" : "focus:ring-emerald-500";
  return `w-full px-6 py-4 rounded-2xl bg-slate-50 border ${
    hasError ? "border-red-200" : "border-transparent"
  } ${ring} focus:ring-2 outline-none transition-all font-semibold text-slate-700`;
}

const TabButton: React.FC<
  React.PropsWithChildren<{ active: boolean; onClick: () => void; disabled?: boolean; title?: string }>
> = ({ active, onClick, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={[
      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
      disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95",
      active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-500",
    ].join(" ")}
  >
    {children}
  </button>
);