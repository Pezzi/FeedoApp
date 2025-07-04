// src/components/modals/EditQRCodeModal.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, QrCode as QrCodeIcon } from 'lucide-react';
import { useQRCodeOperations, type QRCode } from '../../hooks/useQRCodes_OLD';
import { toast } from 'react-toastify';

interface EditQRCodeModalProps {
  qrCode: QRCode | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para atualizar a lista na página principal
}

export const EditQRCodeModal: React.FC<EditQRCodeModalProps> = ({ qrCode, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { updateQRCode, loading } = useQRCodeOperations();

  useEffect(() => {
    // Preenche o formulário quando um QR Code é selecionado
    if (qrCode) {
      setFormData({
        name: qrCode.name,
        description: qrCode.description || '',
      });
    }
  }, [qrCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode) return;

    try {
      await updateQRCode(qrCode.id, formData);
      toast.success('QR Code atualizado com sucesso!');
      onSuccess(); // Chama a função para refazer a busca na página de lista
      onClose(); // Fecha o modal
    } catch (error) {
      toast.error('Erro ao atualizar o QR Code.');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content 
          className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#232323] p-6 shadow-lg z-50 focus:outline-none"
        >
          <Dialog.Title className="text-white font-bold text-lg mb-4">
            Editar QR Code
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 text-sm mb-5">
            Faça as alterações necessárias e clique em salvar.
          </Dialog.Description>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome do QR Code *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-lemon focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descrição *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-lemon focus:border-transparent resize-none" required />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                  Cancelar
                </button>
              </Dialog.Close>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-lemon text-gray-900 rounded-lg font-medium hover:bg-lemon-dark transition-colors flex items-center space-x-2 disabled:opacity-50">
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="text-gray-400 hover:text-white absolute top-4 right-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500" aria-label="Close">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};