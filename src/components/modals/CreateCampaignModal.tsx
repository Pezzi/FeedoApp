// src/components/modals/CreateCampaignModal.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';

// Nossos Componentes e Hooks
import { StyledInput } from '../forms/StyledInput';
import { StyledTextarea } from '../forms/StyledTextarea';
import { StyledSelect } from '../forms/StyledSelect';
import { StyledDatePicker } from '../forms/StyledDatePicker';
import { useQRCodes } from '../../hooks/useQRCodes_OLD'; // Hook para buscar os QR Codes
import { useCampaignOperations, type Campaign } from '../../hooks/useCampaigns'; // Importando o tipo correto

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para atualizar a lista de campanhas
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { qrCodes, loading: loadingQRCodes } = useQRCodes();
  const { createCampaign, loading: isCreating } = useCampaignOperations();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [qrCodeId, setQrCodeId] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !qrCodeId) {
      toast.warn("O nome da campanha e o QR Code vinculado são obrigatórios.");
      return;
    }
    try {
      await createCampaign({
        name,
        description,
        qr_code_id: qrCodeId,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
        is_active: true
      });
      toast.success("Campanha criada com sucesso!");
      onSuccess();
      // Não precisamos mais fechar aqui, o onSuccess vai recarregar os dados e podemos fechar na página
    } catch (err) {
      toast.error("Erro ao criar a campanha.");
      console.error(err);
    }
  };

  // Limpa o formulário quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setQrCodeId('');
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-fundo-card w-full max-w-2xl rounded-2xl shadow-lg border border-[#1E1E1E] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex justify-between items-center border-b border-[#1E1E1E]">
              <h2 className="text-lg font-bold text-white">Criar Nova Campanha</h2>
              <button onClick={onClose} className="p-1 rounded-full text-texto-normal/70 hover:text-white hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-2 text-texto-normal">Nome da Campanha *</label>
                  <StyledInput type="text" placeholder="Ex: Feedback de Atendimento - Verão" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-texto-normal">Descrição</label>
                  <StyledTextarea placeholder="Descreva o objetivo desta campanha..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-texto-normal">Vincular ao QR Code *</label>
                  <StyledSelect value={qrCodeId} onChange={(e) => setQrCodeId(e.target.value)} required>
                    <option value="" disabled>Selecione um QR Code</option>
                    {loadingQRCodes ? (
                      <option disabled>Carregando QR Codes...</option>
                    ) : (
                      qrCodes.map(qr => <option key={qr.id} value={qr.id}>{qr.name}</option>)
                    )}
                  </StyledSelect>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-texto-normal">Data de Início</label>
                    <StyledDatePicker date={startDate} setDate={setStartDate} placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-texto-normal">Data de Fim (opcional)</label>
                    <StyledDatePicker date={endDate} setDate={setEndDate} placeholder="dd/mm/aaaa" />
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-end bg-[#1E1E1E]/50 border-t border-[#1E1E1E]">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-48 flex items-center justify-center gap-2 bg-realce text-fundo-card font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={20} className="animate-spin" /> : <><Send size={18} /><span>Criar Campanha</span></>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};