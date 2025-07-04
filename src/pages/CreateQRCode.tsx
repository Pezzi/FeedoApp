// src/pages/CreateQRCode.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { ArrowLeft, Check, Copy, Download, RotateCw, CheckCircle, Loader2 } from 'lucide-react';

import { StyledInput } from '../components/forms/StyledInput';
import { StyledTextarea } from '../components/forms/StyledTextarea';
import { HelpTooltip } from '../components/ui/HelpTooltip';
import { useQRCodeManager } from '../hooks/useQRCodeManager';
import type { QRCode } from '../hooks/useQRCodes_OLD';

export const CreateQRCode: React.FC = () => {
    const navigate = useNavigate();
    const { createQRCode, loading } = useQRCodeManager();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [destinationUrl, setDestinationUrl] = useState('');
    const [createdQRCode, setCreatedQRCode] = useState<QRCode | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !destinationUrl) {
            toast.warn('O nome e a URL de destino são obrigatórios.');
            return;
        }
        try {
            const newQRCode = await createQRCode({
                name, description, destination_url: destinationUrl,
                color_scheme: 'default', is_active: true, logo_url: null
            });
            toast.success(`QR Code "${name}" criado com sucesso!`);
            setCreatedQRCode(newQRCode);
        } catch (err) {
            toast.error('Ocorreu um erro ao criar o QR Code.');
            console.error(err);
        }
    };

    if (createdQRCode) {
        const uniqueFeedbackLink = `${window.location.origin}/f/${createdQRCode.id}`;

        const handleCopyLink = () => {
            navigator.clipboard.writeText(uniqueFeedbackLink);
            toast.info("Link de feedback copiado!");
        };

        const handleDownloadPNG = () => {
            const svgElement = document.getElementById('final-qrcode');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                const img = new Image();
                img.onload = () => {
                    const scale = 4;
                    canvas.width = 192 * scale; // Usando o tamanho do QR Code como base
                    canvas.height = 192 * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const pngUrl = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.href = pngUrl;
                    downloadLink.download = `${createdQRCode.name}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                };
                img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
            }
        };

        const handleDownloadSVG = () => {
            const svgElement = document.getElementById('final-qrcode');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                const svgUrl = URL.createObjectURL(svgBlob);
                const downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = `${createdQRCode.name}.svg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(svgUrl);
            }
        };

        const createAnother = () => {
            setCreatedQRCode(null);
            setName('');
            setDescription('');
            setDestinationUrl('');
        };

        return (
            <div className="space-y-6 flex flex-col items-center justify-center text-center animate-fade-in">
                <CheckCircle size={64} className="text-realce" />
                <h1 className="text-2xl font-bold text-white">QR Code Criado com Sucesso!</h1>
                <p className="text-texto-normal/70 max-w-lg">Compartilhe o link ou baixe o código para usar em materiais físicos.</p>
                <div className="bg-fundo-card p-8 rounded-2xl shadow-lg flex flex-col items-center gap-6">
                    <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG id="final-qrcode" value={uniqueFeedbackLink} size={192} />
                    </div>
                    <div className="w-full flex items-center bg-[#1E1E1E] p-2 rounded-lg">
                        <input type="text" readOnly value={uniqueFeedbackLink} className="bg-transparent text-texto-normal/80 text-sm flex-1 focus:outline-none" />
                        <button onClick={handleCopyLink} className="p-2 text-texto-normal/70 hover:text-realce transition-colors" title="Copiar Link"><Copy size={18} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <button onClick={createAnother} className="flex items-center gap-2 text-texto-normal hover:text-realce transition-colors"><RotateCw size={16} />Criar Outro</button>
                    <button onClick={handleDownloadPNG} className="flex items-center gap-2 bg-fundo-card border border-[#1E1E1E] text-texto-normal font-bold py-2 px-4 rounded-lg hover:border-realce transition-all">Baixar PNG</button>
                    <button onClick={handleDownloadSVG} className="flex items-center gap-2 bg-realce text-fundo-card font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"><Download size={18} />Baixar SVG (Impressão)</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link to="/qr-codes" className="flex items-center gap-2 text-sm text-texto-normal/70 hover:text-realce transition-colors mb-4"><ArrowLeft size={16} />Voltar para Meus QR Codes</Link>
                <h1 className="text-2xl font-bold text-realce">Criar Novo QR Code</h1>
                <p className="mt-1 text-sm text-texto-normal/70">Preencha os detalhes abaixo para gerar seu novo código.</p>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-fundo-card p-8 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">Nome do QR Code</label>
                        <StyledInput type="text" placeholder="Ex: Campanha de Inverno" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-medium text-white">URL de Destino Final</label>
                        <HelpTooltip content="Para onde seu cliente será redirecionado APÓS deixar o feedback. Ex: o cardápio online ou o Instagram do seu negócio." />
                      </div>
                      <StyledInput type="url" placeholder="https://seusite.com/pagina-de-destino" value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-white">Descrição (Opcional)</label>
                        <StyledTextarea placeholder="Uma breve descrição sobre o propósito deste QR Code." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="pt-6 border-t border-[#1E1E1E]">
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-realce text-fundo-card font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (<><Loader2 size={20} className="animate-spin" /><span>Salvando...</span></>) : (<><Check size={20} /><span>Salvar e Criar QR Code</span></>)}
                        </button>
                    </div>
                </div>
                <div className="bg-fundo-card p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-realce mb-4">Pré-visualização</h3>
                    <div className="bg-white p-4 rounded-lg"><QRCodeSVG value={destinationUrl || 'https://example.com'} size={192} level={"H"} /></div>
                    <p className="text-sm text-texto-normal/70 mt-4">A pré-visualização mostra a URL de destino. O QR Code final apontará para o seu link de feedback exclusivo.</p>
                </div>
            </form>
        </div>
    );
};