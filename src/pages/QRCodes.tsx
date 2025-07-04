// src/pages/QRCodes.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, QrCode, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

import { useQRCodes, type QRCode } from '../hooks/useQRCodes_OLD'; 
import { useQRCodeManager } from '../hooks/useQRCodeManager';
import { toast } from 'react-toastify';
import { EditQRCodeModal } from '../components/modals/EditQRCodeModal';
import { KPICard } from '../components/dashboard/KPICard';
import { KPICardSkeleton } from '../components/dashboard/KPICardSkeleton';
import { QRCodeCard } from '../components/qrcodes/QRCodeCard';
import { QRCodeCardSkeleton } from '../components/qrcodes/QRCodeCardSkeleton';
import { EmptyState } from '../components/qrcodes/EmptyState';


export const QRCodes: React.FC = () => {
  const { qrCodes, loading, error, refetch } = useQRCodes();
  const { deleteQRCode, loading: isDeleting } = useQRCodeManager(); 
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o QR Code "${name}"?`)) {
      try {
        await deleteQRCode(id);
        toast.success(`QR Code "${name}" excluído com sucesso!`);
        refetch();
      } catch (err) {
        toast.error("Erro ao excluir o QR Code.");
        console.error(err);
      }
    }
  };

  const handleShare = (url: string) => {
      navigator.clipboard.writeText(url);
      toast.info('URL do QR Code copiada para a área de transferência!');
  };

  return (
    <>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-realce">Meus QR Codes</h1>
              <p className="mt-1 text-sm text-texto-normal/70">
                Gerencie, edite e acompanhe seus códigos.
              </p>
            </div>
            <Link
              to="/qr-codes/create"
              className="flex items-center gap-2 bg-realce text-fundo-card font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Novo QR Code</span>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading ? (
              <>
                <KPICardSkeleton />
                <KPICardSkeleton />
                <KPICardSkeleton />
                <KPICardSkeleton />
              </>
            ) : (
              <>
                <KPICard title="Total de QR Codes" value={qrCodes.length} />
                <KPICard title="Ativos" value={qrCodes.filter(qr => qr.is_active).length} />
                <KPICard title="Total de Scans" value={qrCodes.reduce((acc, qr) => acc + (qr.scans ?? 0), 0)} />
                <KPICard title="Total de Feedbacks" value={qrCodes.reduce((acc, qr) => acc + (qr.feedbacks ?? 0), 0)} />
              </>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <QRCodeCardSkeleton />
                <QRCodeCardSkeleton />
                <QRCodeCardSkeleton />
              </>
            ) : error ? (
              <p className="text-red-400 col-span-full text-center">Erro ao carregar os QR Codes.</p>
            ) : qrCodes.length === 0 ? (
              <div className="lg:col-span-3 md:col-span-2 col-span-1">
                <EmptyState 
                    icon={QrCode}
                    title="Nenhum QR Code encontrado"
                    message="Comece a coletar feedbacks criando seu primeiro QR Code."
                    buttonText="Criar meu primeiro QR Code"
                    buttonLink="/qr-codes/create"
                />
              </div>
            ) : (
              qrCodes.map((qrCode, index) => (
                <motion.div 
                  key={qrCode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <QRCodeCard
                    qrCode={qrCode}
                    onShare={() => handleShare(`${window.location.origin}/f/${qrCode.id}`)}
                    onEdit={() => setEditingQRCode(qrCode)}
                    onDelete={() => handleDelete(qrCode.id, qrCode.name)}
                    isDeleting={isDeleting}
                  />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <EditQRCodeModal
        qrCode={editingQRCode}
        isOpen={!!editingQRCode}
        onClose={() => setEditingQRCode(null)}
        onSuccess={refetch}
      />
    </>
  );
};