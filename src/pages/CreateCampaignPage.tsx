import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQRCodeOperations, useQRCodes } from '../hooks/useQRCodes_OLD';
import { useCampaignOperations } from '../hooks/useCampaigns';
import { toast } from 'react-toastify';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

export const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  // Busca a lista de QR Codes para popular o dropdown
  const { qrCodes, loading: qrCodesLoading } = useQRCodes();
  // Hook para a operação de criar a campanha
  const { createCampaign, loading: isCreating } = useCampaignOperations();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    qr_code_id: '', // Começa vazio
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.qr_code_id) {
      toast.warn("Por favor, selecione um QR Code para associar a esta campanha.");
      return;
    }
    try {
      await createCampaign(formData);
      toast.success("Campanha criada com sucesso!");
      navigate('/campaigns');
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar a campanha.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/campaigns')} className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-white">Nova Campanha</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg max-w-2xl mx-auto" style={{ backgroundColor: '#232323' }}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome da Campanha *</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white resize-none" />
          </div>
          <div>
            <label htmlFor="qr_code_id" className="block text-sm font-medium text-gray-300 mb-2">Vincular ao QR Code *</label>
            <select
              name="qr_code_id"
              id="qr_code_id"
              value={formData.qr_code_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white disabled:opacity-50"
              required
              disabled={qrCodesLoading}
            >
              <option value="">{qrCodesLoading ? 'Carregando...' : 'Selecione um QR Code'}</option>
              {qrCodes.map(qr => (
                <option key={qr.id} value={qr.id}>{qr.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-300 mb-2">Data de Início</label>
              <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white" />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-300 mb-2">Data de Fim (opcional)</label>
              <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white" />
            </div>
          </div>
        </div>
        <div className="pt-6 mt-6 border-t border-gray-700 flex justify-end">
          <button type="submit" disabled={isCreating} className="px-6 py-3 bg-lemon text-gray-900 rounded-lg font-bold hover:bg-lemon-dark transition-colors disabled:opacity-50 flex items-center gap-2">
            {isCreating ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5"/>}
            {isCreating ? 'Criando Campanha...' : 'Criar Campanha'}
          </button>
        </div>
      </form>
    </div>
  );
};