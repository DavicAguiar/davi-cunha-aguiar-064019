import React, { useState } from 'react';
import type { Tutor } from '../../models/tutor.model';
import { tutorFacade } from '../../facades/tutor.facade';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorToDelete?: Tutor | null;
}

export const DeleteTutorModal: React.FC<DeleteTutorModalProps> = ({ isOpen, onClose, tutorToDelete }) => {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !tutorToDelete) return null;

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await tutorFacade.deleteTutor(tutorToDelete.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[110] p-6">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden p-10 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors">
          <X size={28} strokeWidth={1.5} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Confirmar exclusão</h3>
            <p className="text-sm text-slate-600 mt-2">
              Você tem certeza que deseja excluir o tutor <span className="font-bold">{tutorToDelete.nome}</span>?
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
              Esta ação não poderá ser desfeita
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={submitting}
            className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 active:scale-95 transition disabled:opacity-60"
          >
            {submitting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};
