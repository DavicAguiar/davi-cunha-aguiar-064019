import React, { useState, useEffect, useRef } from 'react';
import { petFacade } from '../../facades/pet.facade';
import type { Pet } from '../../models/pet.model';
import { Camera, X, CheckCircle, Save } from 'lucide-react';

interface PetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToEdit?: Pet | null;
}

export const PetFormModal: React.FC<PetFormModalProps> = ({ isOpen, onClose, petToEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const MAX_NOME = 80;
  const MAX_RACA = 80;

  const [form, setForm] = useState({ nome: '', raca: '', idade: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (petToEdit) {
      setForm({
        nome: petToEdit.nome ?? '',
        raca: petToEdit.raca ?? '',
        idade: petToEdit.idade?.toString() ?? ''
      });
      setPreviewUrl(petToEdit.foto?.url || '');
    } else {
      setForm({ nome: '', raca: '', idade: '' });
      setPreviewUrl('');
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
    
    if (!form.nome?.trim()) errs.nome = "Nome é obrigatório";
    if (!form.raca?.trim()) errs.raca = "Raça é obrigatória";
    
    if (!form.idade) errs.idade = "Informe a idade";
    // if (!previewUrl) errs.foto = "A imagem do pet é obrigatória";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nome: form.nome,
        raca: form.raca,
        idade: Number(form.idade)
      };

      await petFacade.savePet(
        payload,
        selectedFile,
        petToEdit?.id 
      );
      
      onClose();
    } catch (err) {
      console.error("Erro na operação:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-white w-full max-w-6xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
        
        <div className="md:w-5/12 bg-slate-50 p-12 flex flex-col items-center border-r border-slate-100">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-square rounded-[3rem] bg-white border-2 border-dashed 
              ${errors.foto ? 'border-red-300' : 
              'border-slate-200'} shadow-inner flex items-center justify-center
               overflow-hidden cursor-pointer hover:border-emerald-500 transition-all group`}
          >
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center text-slate-300 group-hover:text-emerald-500 transition-colors">
                <Camera size={64} strokeWidth={1.5} />
                <p className="text-[10px] font-black uppercase tracking-widest mt-6 text-center">Anexar<br/>Fotografia</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </div>
          {errors.foto && <p className="text-red-500 text-[10px] font-bold mt-4 uppercase">{errors.foto}</p>}
          
          <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
            Formatos: JPG, PNG ou WEBP <br/> Resolução recomendada: 800x800px
          </p>
        </div>

        <div className="md:w-7/12 p-16 relative bg-white">
          <button onClick={onClose} className="absolute top-10 right-12 text-slate-300 hover:text-red-500 transition-colors">
            <X size={32} strokeWidth={1} />
          </button> 
                   
          <header className="mb-12">
            <h3 className="text-5xl font-black text-slate-800 tracking-tighter italic leading-none mb-4">
              {petToEdit ? 'ATUALIZAR' : 'REGISTRO'} <span className="text-emerald-600 uppercase">Pet</span>
            </h3>
            <div className="h-1.5 w-24 bg-emerald-600 rounded-full mb-6"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
              Secretaria de Planejamento e Gestão - MT
            </p>
          </header>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Nome do Animal</label>
              <input 
                maxLength={MAX_NOME}
                className={`px-8 py-6 rounded-[1.8rem] bg-slate-50 border ${errors.nome ? 'border-red-200' : 'border-transparent'} focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-700`}
                value={form.nome}
                onChange={e => setForm({...form, nome: e.target.value})}
                placeholder="Ex: Nitro"
              />
            </div>


            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Idade (Anos)</label>
              <input 
                maxLength={2}
                className={`px-8 py-6 rounded-[1.8rem] bg-slate-50 border ${errors.idade ? 'border-red-200' : 'border-transparent'} focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono font-bold text-xl`}
                value={form.idade}
                onChange={e => setForm({...form, idade: e.target.value.replace(/\D/g, '')})}
                placeholder="00"
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Raça Predominante</label>
              <input 
                maxLength={MAX_RACA}
                className={`px-8 py-6 rounded-[1.8rem] bg-slate-50 border ${errors.raca ? 'border-red-200' : 'border-transparent'} focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold`}
                value={form.raca}
                onChange={e => setForm({...form, raca: e.target.value})}
                placeholder="Ex: Pastor Alemão"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="sm:col-span-2 py-7 bg-violet-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-violet-200 hover:bg-violet-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                petToEdit ? <Save size={18} /> : <CheckCircle size={18} />
              )}
              {isSubmitting ? 'Sincronizando...' : (petToEdit ? 'Salvar Alterações' : 'Efetivar Cadastro')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};