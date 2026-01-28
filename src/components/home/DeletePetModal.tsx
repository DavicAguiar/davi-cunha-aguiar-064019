import React, { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { petFacade } from "../../facades/pet.facade";
import type { Pet } from "../../models/pet.model";
import { uiActions } from "../../state/ui.state";

interface DeletePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToDelete: Pet | null;
}

export const DeletePetModal: React.FC<DeletePetModalProps> = ({
  isOpen,
  onClose,
  petToDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !petToDelete) return null;

  const handleDelete = async () => {
    if (!petToDelete.id) return;

    setIsDeleting(true);
    try {
      await petFacade.deletePet(petToDelete.id);
      uiActions.notify("O registro foi removido com sucesso!", "success");
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Falha ao excluir o registro.";
      uiActions.notify(errorMsg, "error");
      console.error("Erro detalhado na exclusão:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] p-6 animate-in fade-in duration-200
                 bg-[color:var(--modal-overlay-strong)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-[2.5rem] p-10 relative text-center animate-in zoom-in-95 duration-200
                   bg-[color:var(--modal-bg)] border border-[color:var(--modal-border)]
                   text-[color:var(--modal-text)]"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-6 right-6 rounded-xl p-2 transition-colors cursor-pointer
                     text-[color:var(--modal-muted-2)]
                     hover:bg-[color:var(--modal-ghost-hover-bg)]
                     disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Fechar"
        >
          <X size={22} strokeWidth={2} />
        </button>

        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-500/10 mb-8">
          <AlertTriangle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
        </div>

        <h3 className="text-2xl font-black leading-none mb-4 text-[color:var(--modal-text)]">
          Excluir Registro?
        </h3>

        <p className="text-sm font-bold leading-relaxed mb-10 text-[color:var(--modal-muted)]">
          Você está prestes a remover{" "}
          <span className="text-[color:var(--modal-text)] font-black">
            "{petToDelete.nome}"
          </span>{" "}
          permanentemente do sistema. Essa ação não pode ser desfeita.
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
                       border border-[color:var(--modal-border)]
                       bg-[color:var(--modal-bg)] text-[color:var(--modal-muted)]
                       hover:bg-[color:var(--modal-ghost-hover-bg)] hover:text-[color:var(--modal-text)]
                       transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
                       bg-red-600 text-white hover:bg-red-700
                       transition-all flex items-center justify-center gap-3
                       disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Sim, Excluir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
