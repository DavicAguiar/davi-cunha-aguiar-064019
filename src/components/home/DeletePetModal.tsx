import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { petFacade } from '../../facades/pet.facade';
import type { Pet } from '../../models/pet.model';
import { uiActions } from '../../state/ui.state';

interface DeletePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToDelete: Pet | null;
}

export const DeletePetModal: React.FC<DeletePetModalProps> = ({ isOpen, onClose, petToDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !petToDelete) return null;

  const handleDelete = async () => {
  if (!petToDelete.id) return;
  
  setIsDeleting(true);
    try {
      await petFacade.deletePet(petToDelete.id);
      
      uiActions.notify('O registro foi removido com sucesso!', 'success');
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Falha ao excluir o registro.';
      
      uiActions.notify(errorMsg, 'error');
      console.error("Erro detalhado na exclusão:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex
     items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem]
       shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 text-center">
        
        <button 
          onClick={onClose} 
          disabled={isDeleting}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-60
           transition-colors disabled:opacity-0 cursor-pointer"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-50 mb-8">
          <AlertTriangle className="h-12 w-12 text-red-500" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-2xl font-black text-slate-800 leading-none mb-4">
          Excluir Registro?
        </h3>

        <p className="text-sm font-bold text-slate-500 leading-relaxed mb-10">
          Você está prestes a remover 
          <span className="text-slate-800 font-black">"{petToDelete.nome}"</span>
          permanentemente do sistema. Essa ação não pode ser desfeita.
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black
             text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200
              transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px]
             uppercase tracking-[0.2em] shadow-xl shadow-red-200/50 hover:bg-red-700
              transition-all flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer"
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