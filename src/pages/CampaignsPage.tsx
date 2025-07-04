import React, { useState } from 'react'; // Importamos o useState
import { useCampaigns, useCampaignOperations } from '../hooks/useCampaigns';
import { Plus, Play, Pause, Edit, Trash2, QrCode } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Nossos componentes
import { CampaignsTableSkeleton } from '../components/campaigns/CampaignsTableSkeleton';
import { EmptyState } from '../components/qrcodes/EmptyState';
import { CreateCampaignModal } from '../components/modals/CreateCampaignModal';

export const CampaignsPage: React.FC = () => {
  const { campaigns, loading, error, refetch } = useCampaigns();
  const { deleteCampaign, updateCampaign, loading: isOperating } = useCampaignOperations();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a campanha "${name}"?`)) {
      await deleteCampaign(id);
      toast.success("Campanha excluída com sucesso.");
      refetch();
    }
  };

  const toggleCampaignStatus = async (id: string, currentStatus: boolean) => {
    await updateCampaign(id, { is_active: !currentStatus });
    toast.info(`Campanha ${!currentStatus ? 'ativada' : 'pausada'}.`);
    refetch();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-realce">Campanhas</h1>
            <p className="text-sm text-texto-normal/70">Crie e gerencie suas campanhas de coleta de feedback.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-realce text-fundo-card font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Nova Campanha</span>
          </button>
        </div>
        
        <div className="bg-fundo-card rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-texto-normal">
              <thead className="text-xs text-texto-normal/70 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium">Nome da Campanha</th>
                  <th scope="col" className="px-6 py-4 font-medium">QR Code Vinculado</th>
                  <th scope="col" className="px-6 py-4 font-medium">Período</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              {!loading && campaigns.length > 0 && (
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <motion.tr 
                      key={campaign.id} 
                      className="border-t border-[#1E1E1E] hover:bg-white/5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${campaign.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-texto-normal/70'}`}>
                          <span className={`h-2 w-2 rounded-full ${campaign.is_active ? 'bg-green-500' : 'bg-texto-normal/50'}`}></span>
                          {campaign.is_active ? 'Ativa' : 'Pausada'}
                        </span>
                      </td>
                      <td scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{campaign.name}</td>
                      <td className="px-6 py-4 flex items-center gap-2"><QrCode size={16} className="text-texto-normal/70"/>{campaign.qr_codes?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('pt-BR') : 'N/A'} - {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('pt-BR') : 'Contínuo'}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                        <button onClick={() => toggleCampaignStatus(campaign.id, campaign.is_active)} disabled={isOperating} className="p-2 text-texto-normal/70 hover:text-realce rounded-lg disabled:opacity-50 transition-colors" title={campaign.is_active ? 'Pausar' : 'Ativar'}>
                          {campaign.is_active ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button disabled={isOperating} className="p-2 text-texto-normal/70 hover:text-realce rounded-lg disabled:opacity-50 transition-colors" title="Editar"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(campaign.id, campaign.name)} disabled={isOperating} className="p-2 text-texto-normal/70 hover:text-red-500 rounded-lg disabled:opacity-50 transition-colors" title="Excluir"><Trash2 size={16} /></button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              )}
              {loading && <CampaignsTableSkeleton />}
            </table>
            {!loading && campaigns.length === 0 && (
              <div className="p-8">
                <EmptyState 
                    title="Nenhuma campanha criada"
                    message="Comece criando sua primeira campanha para coletar feedbacks."
                    buttonText="Criar Primeira Campanha"
                    buttonLink="/campaigns/create"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateCampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </>
  );
};