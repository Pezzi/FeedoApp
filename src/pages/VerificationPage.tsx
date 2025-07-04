// src/pages/VerificationPage.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Nossos Componentes
import { VerificationPageSkeleton } from '../components/verification/VerificationPageSkeleton';
import { DocumentUploader } from '../components/verification/DocumentUploader';

// Hook de exemplo para simular a busca do status de verificação
const useVerificationStatus = () => {
    const [status, setStatus] = useState<'not_verified' | 'pending' | 'verified'>('not_verified');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);
    return { status, loading, setStatus };
}

export const VerificationPage: React.FC = () => {
  const { status, loading, setStatus } = useVerificationStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofDocument, setProofDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idDocument || !proofDocument) {
      toast.warn("Por favor, envie os dois documentos.");
      return;
    }
    setIsSubmitting(true);
    // NOTA: Aqui entraria a lógica de upload dos arquivos para o Supabase Storage
    console.log("Enviando documentos:", { idDocument, proofDocument });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simula o upload
    
    toast.success("Documentos enviados com sucesso! Nossa equipe irá analisar.");
    setStatus('pending');
    setIsSubmitting(false);
  };

  const StatusCard = () => {
    const statusInfo = {
      not_verified: { icon: Shield, color: 'text-texto-normal/70', title: 'Não Verificado', message: 'Complete o processo de verificação para ganhar seu selo e aumentar a confiança dos clientes.' },
      pending: { icon: Clock, color: 'text-yellow-500', title: 'Verificação Pendente', message: 'Seus documentos foram recebidos e estão em análise. O processo leva em média 48 horas.' },
      verified: { icon: CheckCircle, color: 'text-green-500', title: 'Perfil Verificado', message: 'Parabéns! Seu perfil agora tem o selo de verificação, aumentando sua credibilidade na plataforma.' }
    };
    const currentStatus = statusInfo[status];
    const Icon = currentStatus.icon;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="bg-fundo-card p-8 rounded-2xl flex items-center gap-6">
          <Icon className={`h-16 w-16 flex-shrink-0 ${currentStatus.color}`} />
          <div>
            <h3 className={`text-lg font-bold ${currentStatus.color}`}>{currentStatus.title}</h3>
            <p className="text-texto-normal/80">{currentStatus.message}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return <VerificationPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-realce">Verificação de Perfil</h1>
        <p className="text-sm text-texto-normal/70 mt-1">Envie seus documentos para ganhar o selo de verificado.</p>
      </motion.div>

      <StatusCard />

      {status === 'not_verified' && (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="bg-fundo-card p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-semibold text-white">Envio de Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DocumentUploader label="Documento de Identidade (Frente e Verso)" onFileSelect={setIdDocument} />
              <DocumentUploader label="Comprovante de Endereço ou CNPJ" onFileSelect={setProofDocument} />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-48 flex items-center justify-center gap-2 bg-realce text-fundo-card font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Enviar para Análise'}
              </button>
            </div>
          </div>
        </motion.form>
      )}
    </div>
  );
};