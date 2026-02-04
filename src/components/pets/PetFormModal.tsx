import React, { useState, useEffect, useRef } from "react";
import { petFacade } from "../../facades/pet.facade";
import type { Pet } from "../../models/pet.model";
import { Camera, X, CheckCircle, Save } from "lucide-react";

interface PetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToEdit?: Pet | null;
}

export const PetFormModal: React.FC<PetFormModalProps> = ({ isOpen, onClose, petToEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

  const MAX_NOME = 100;
  const MAX_RACA = 100;

  const [form, setForm] = useState({ nome: "", raca: "", idade: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (petToEdit) {
      setForm({
        nome: petToEdit.nome ?? "",
        raca: petToEdit.raca ?? "",
        idade: petToEdit.idade?.toString() ?? "",
      });
      setPreviewUrl(petToEdit.foto?.url || "");
    } else {
      setForm({ nome: "", raca: "", idade: "" });
      setPreviewUrl("");
    }

    setSelectedFile(null);
    setErrors({});
  }, [isOpen, petToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) return alert("Arquivo muito grande (Máx 3MB)");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    const nome = normalizeText(form.nome);
    const raca = normalizeText(form.raca);

    if (!nome) errs.nome = "Nome é obrigatório";
    else if (nome.length > MAX_NOME) errs.nome = `Nome deve ter no máximo ${MAX_NOME} caracteres`;

    if (!raca) errs.raca = "Raça é obrigatória";
    else if (raca.length > MAX_RACA) errs.raca = `Raça deve ter no máximo ${MAX_RACA} caracteres`;

    if (!form.idade) errs.idade = "Informe a idade";
    else {
      const idadeNum = Number(form.idade);
      if (!Number.isInteger(idadeNum)) errs.idade = "Idade deve ser um número inteiro";
      else if (idadeNum < 0 || idadeNum > 99) errs.idade = "Idade deve estar entre 0 e 99";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nome: normalizeText(form.nome),
        raca: normalizeText(form.raca),
        idade: Number(form.idade),
      };

      await petFacade.savePet(payload, selectedFile, petToEdit?.id);
      onClose();
    } catch (err) {
      console.error("Erro na operação:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = (hasError?: boolean) =>
    [
      "px-8 py-6 rounded-[1.8rem] outline-none transition-all font-semibold",
      "bg-[color:var(--modal-bg)] border",
      hasError ? "border-red-300" : "border-[color:var(--modal-border)]",
      "text-[color:var(--modal-text)] placeholder:text-[color:var(--modal-muted-2)]",
      "focus:ring-2 focus:ring-[color:var(--primary)]",
    ].join(" ");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 bg-[color:var(--modal-overlay-strong)] backdrop-blur-md">
      <div className="w-full max-w-6xl rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row
        border border-[color:var(--modal-border)]
        bg-[color:var(--modal-bg)]
        animate-in fade-in zoom-in duration-300"
      >
        <div className="md:w-5/12 p-12 flex flex-col items-center border-r
          border-[color:var(--modal-border)]
          bg-[image:var(--modal-header-bg)]"
        >
          <div
            onClick={() => fileInputRef.current?.click()}
            className={[
              "w-full aspect-square rounded-[3rem] border-2 border-dashed overflow-hidden cursor-pointer",
              "flex items-center justify-center transition-all group",
              errors.foto ? "border-red-300" : "border-[color:var(--modal-border)]",
              "bg-[color:var(--modal-bg)] hover:border-emerald-500",
            ].join(" ")}
          >
            {previewUrl ? (
              <img src={previewUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                alt="Preview"
              />
            ) : (
              <div className="flex flex-col items-center text-[color:var(--modal-muted-2)] group-hover:text-emerald-600 transition-colors">
                <Camera size={64} strokeWidth={1.5} />
                <p className="text-[10px] font-black uppercase tracking-widest mt-6 text-center">
                  Anexar
                  <br />
                  Fotografia
                </p>
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </div>

          {errors.foto ? (
            <p className="text-red-500 text-[10px] font-bold mt-4 uppercase">{errors.foto}</p>
          ) : null}

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-center leading-relaxed text-[color:var(--modal-muted-2)]">
            Formatos: JPG, PNG ou WEBP <br /> Resolução recomendada: 800x800px
          </p>
        </div>

        <div className="md:w-7/12 p-16 relative bg-[color:var(--modal-bg)]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-10 right-12 rounded-xl p-2 transition-colors cursor-pointer
              text-[color:var(--modal-muted-2)] hover:bg-[color:var(--modal-ghost-hover-bg)]"
            aria-label="Fechar"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          <header className="mb-12">
            <h3 className="text-5xl font-black tracking-tighter italic leading-none mb-4 text-[color:var(--modal-text)]">
              {petToEdit ? "ATUALIZAR" : "REGISTRO"} <span className="text-emerald-600 uppercase">Pet</span>
            </h3>

            <div className="h-1.5 w-24 bg-[color:var(--primary)] rounded-full mb-6"></div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[color:var(--modal-muted-2)]">
              Secretaria de Planejamento e Gestão - MT
            </p>
          </header>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-[10px] font-black uppercase ml-1 tracking-widest text-[color:var(--modal-muted-2)]">
                Nome do Animal
              </label>
              <input
                maxLength={MAX_NOME}
                className={inputCls(!!errors.nome)}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Nitro"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase ml-1 tracking-widest text-[color:var(--modal-muted-2)]">
                Idade (Anos)
              </label>
              <input
                maxLength={2}
                className={[
                  inputCls(!!errors.idade),
                  "font-mono font-bold text-xl tabular-nums",
                ].join(" ")}
                value={form.idade}
                onChange={(e) => setForm({ ...form, idade: e.target.value.replace(/\D/g, "") })}
                placeholder="00"
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-[10px] font-black uppercase ml-1 tracking-widest text-[color:var(--modal-muted-2)]">
                Raça Predominante
              </label>
              <input
                maxLength={MAX_RACA}
                className={inputCls(!!errors.raca)}
                value={form.raca}
                onChange={(e) => setForm({ ...form, raca: e.target.value })}
                placeholder="Ex: Pastor Alemão"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="sm:col-span-2 py-7 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em]
                bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]
                transition-all flex items-center justify-center gap-3 disabled:opacity-50
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]
                active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : petToEdit ? (
                <Save size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {isSubmitting ? "Sincronizando..." : petToEdit ? "Salvar Alterações" : "Efetivar Cadastro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
