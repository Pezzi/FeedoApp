// src/components/qrcodes/QRCodeCard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Edit, Download, Share, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import type { QRCode as QRCodeType } from '../../hooks/useQRCodes_OLD';

interface QRCodeCardProps {
  qrCode: QRCodeType;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCode, onShare, onEdit, onDelete, isDeleting }) => {
  console.log("Dados recebidos pelo QRCodeCard:", qrCode); // Linha de Debug

  const [isDownloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    if (isDownloadMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadMenuOpen]);

  const handleDownload = (format: 'png' | 'svg') => {
    const svgElement = document.getElementById(`qrcode-canvas-${qrCode.id}`);
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const fileName = `${qrCode.name || 'qrcode'}.${format}`;
    if (format === 'svg') {
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
          const scale = 4;
          canvas.width = 128 * scale;
          canvas.height = 128 * scale;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
    setDownloadMenuOpen(false);
  };
  
  // Verificação de segurança: se não houver qrCode ou id, não renderiza nada
  if (!qrCode?.id) {
    return null;
  }

  const uniqueFeedbackLink = `${window.location.origin}/f/${qrCode.id}`;

  return (
    <div className="bg-fundo-card p-6 rounded-2xl shadow-lg flex flex-col justify-between transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-realce">{qrCode.name || 'QR Code Sem Nome'}</h3>
            <p className="text-xs text-texto-normal/60 line-clamp-2">{qrCode.description || 'Sem descrição'}</p>
          </div>
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${qrCode.is_active ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-texto-normal/70'}`}>
            {qrCode.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {qrCode.is_active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <div className="my-6 flex items-center justify-center">
          <div className="bg-white p-2 rounded-lg"><QRCodeSVG id={`qrcode-canvas-${qrCode.id}`} value={uniqueFeedbackLink} size={128} /></div>
        </div>
        <div className="flex items-center justify-around text-center border-y border-[#1E1E1E] py-3">
          {/* Adicionamos '?? 0' para garantir que não dê erro se o valor for nulo */}
          <div><p className="text-2xl font-bold text-white">{qrCode.scans ?? 0}</p><p className="text-xs text-texto-normal/60">Scans</p></div>
          <div><p className="text-2xl font-bold text-white">{qrCode.feedbacks ?? 0}</p><p className="text-xs text-texto-normal/60">Feedbacks</p></div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-1">
        <button onClick={onShare} className="p-2 text-texto-normal/70 hover:text-realce transition-colors" title="Copiar Link de Feedback"><Share size={16} /></button>
        <button onClick={onEdit} className="p-2 text-texto-normal/70 hover:text-realce transition-colors" title="Editar"><Edit size={16} /></button>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setDownloadMenuOpen(!isDownloadMenuOpen)} className="p-2 text-texto-normal/70 hover:text-realce transition-colors">
            <Download size={16} />
          </button>
          {isDownloadMenuOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-fundo-card/60 backdrop-blur-lg border border-[#1E1E1E] rounded-xl shadow-xl z-10 animate-fade-in-fast overflow-hidden">
              <button onClick={() => handleDownload('png')} className="w-full text-left px-4 py-2 text-sm text-texto-normal hover:bg-white/10 transition-colors">Baixar PNG (Web)</button>
              <button onClick={() => handleDownload('svg')} className="w-full text-left px-4 py-2 text-sm text-texto-normal hover:bg-white/10 transition-colors">Baixar SVG (Impressão)</button>
            </div>
          )}
        </div>
        <button onClick={onDelete} disabled={isDeleting} className="p-2 text-texto-normal/70 hover:text-red-500 transition-colors disabled:opacity-50" title="Excluir"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};