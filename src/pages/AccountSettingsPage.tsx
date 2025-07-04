import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import { KeyRound, Building, MapPin, Camera, Phone, Mail, Save, Loader2 } from 'lucide-react';
import { useIBGE, type IBGECnaeClass } from '../hooks/useIBGE';
import { motion } from 'framer-motion';

import { SettingsPageSkeleton } from '../components/settings/SettingsPageSkeleton';
import { StyledInput } from '../components/forms/StyledInput';
import { StyledTextarea } from '../components/forms/StyledTextarea';

// O tipo de dados para o perfil do provider
type Provider = {
  id: string;
  user_id: string;
  name?: string;
  business_name?: string;
  description?: string;
  cep?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  contact_email?: string;
  phone?: string;
  website_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  avatar_url?: string;
  cover_image_url?: string;
  segment?: string;
};

export const AccountSettingsPage: React.FC = () => {
  // --- ESTADOS GERAIS ---
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Partial<Provider> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- ESTADOS DO FORMULÁRIO ---
  const [formData, setFormData] = useState<Partial<Provider>>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // --- ESTADOS DAS IMAGENS ---
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // --- DADOS EXTERNOS ---
  const [cnaeClasses, setCnaeClasses] = useState<IBGECnaeClass[]>([]);
  const { fetchCNAEClasses } = useIBGE();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Efeito para buscar o perfil do provider no Supabase
  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await supabase.from('providers').select('*').eq('user_id', userId).single();
        if (error && error.code !== 'PGRST116') throw error;
        if (data) {
          setProfile(data);
          setFormData(data); // Preenche o formulário com os dados existentes
        }
      } catch (err: any) {
        toast.error("Erro ao carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user?.id]);
  
  // Efeito para buscar as classes do CNAE
  useEffect(() => { fetchCNAEClasses().then(setCnaeClasses); }, [fetchCNAEClasses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
      } else {
        setCoverFile(file);
        setCoverPreview(previewUrl);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let finalUpdates: Partial<Provider> = { ...formData };

      // Upload do avatar se um novo arquivo foi selecionado
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('profiles').upload(filePath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('profiles').getPublicUrl(filePath);
        finalUpdates.avatar_url = urlData.publicUrl;
      }

      // Lógica de UPDATE ou INSERT na tabela 'providers'
      const { data: existingProfile } = await supabase.from('providers').select('id').eq('user_id', user.id).single();
      let rpcError;
      if (existingProfile) {
        const { error } = await supabase.from('providers').update(finalUpdates).eq('user_id', user.id);
        rpcError = error;
      } else {
        const { error } = await supabase.from('providers').insert({ ...finalUpdates, user_id: user.id });
        rpcError = error;
      }
      if (rpcError) throw rpcError;
      
      toast.success('Perfil atualizado com sucesso!');
      
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.warn('As senhas não coincidem.'); return; }
    if (newPassword.length < 6) { toast.warn('A nova senha precisa ter no mínimo 6 caracteres.'); return; }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      toast.success('Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar a senha.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-realce">Configurações e Perfil</h1>
        <p className="text-sm text-texto-normal/70 mt-1">Gerencie suas informações que aparecerão no Veepo.</p>
      </motion.div>

      <form onSubmit={handleProfileUpdate} className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="bg-fundo-card rounded-2xl shadow-lg">
                <div className="p-8 pb-4"><h3 className="text-lg font-semibold text-white flex items-center gap-2"><Camera size={20} className="text-realce" />Imagens do Perfil</h3><p className="text-xs text-texto-normal/70 mt-2 ml-8">Recomendação para a imagem de capa: 1200x400 pixels.</p></div>
                <div className="relative h-40 mx-8"><img src={coverPreview || formData.cover_image_url || 'https://via.placeholder.com/800x200?text=Sua+Imagem+de+Capa'} alt="Imagem de Capa" className="w-full h-full object-cover rounded-lg"/><button type="button" onClick={() => coverInputRef.current?.click()} className="absolute bottom-3 right-3 p-2 bg-fundo-card/80 rounded-full text-white hover:bg-realce hover:text-fundo-card transition-all" title="Alterar imagem de capa"><Camera size={16} /></button></div>
                <div className="relative w-32 h-32 rounded-full border-4 border-fundo-card bg-[#1E1E1E] mx-auto mt-[-60px]"><img src={avatarPreview || formData.avatar_url || 'https://via.placeholder.com/150?text=Avatar'} alt="Avatar" className="w-full h-full object-cover rounded-full"/><button type="button" onClick={() => avatarInputRef.current?.click()} className="absolute bottom-1 right-1 p-2 bg-fundo-card/80 rounded-full text-white hover:bg-realce hover:text-fundo-card transition-all" title="Alterar avatar"><Camera size={16} /></button></div>
                <div className="p-4"></div>
            </div>
            <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/png, image/jpeg, image/webp" /><input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'cover')} className="hidden" accept="image/png, image/jpeg, image/webp" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-fundo-card p-8 rounded-2xl shadow-lg"><h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><Building size={20} className="text-realce" />Informações do Negócio</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-medium text-texto-normal mb-2">Seu Nome *</label><StyledInput type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required /></div><div><label className="block text-sm font-medium text-texto-normal mb-2">Nome do Negócio</label><StyledInput type="text" name="business_name" value={formData.business_name || ''} onChange={handleInputChange} /></div><div><label className="block text-sm font-medium text-texto-normal mb-2">Segmento (CNAE)</label><StyledInput list="cnae-options" id="segment" name="segment" value={formData.segment || ''} onChange={handleInputChange} placeholder="Ex: Cabeleireiros..." /><datalist id="cnae-options">{cnaeClasses.map(cnae => (<option key={cnae.id} value={cnae.descricao} />))}</datalist></div><div><label className="block text-sm font-medium text-texto-normal/60 mb-2">Email de Login</label><StyledInput type="email" value={user?.email || ''} disabled className="opacity-50 cursor-not-allowed" /></div><div className="md:col-span-2"><label className="block text-sm font-medium text-texto-normal mb-2">Descrição do Negócio</label><StyledTextarea name="description" value={formData.description || ''} onChange={handleInputChange} /></div></div></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="bg-fundo-card p-8 rounded-2xl shadow-lg"><h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><MapPin size={20} className="text-realce" />Localização</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-medium text-texto-normal mb-2">CEP</label><StyledInput type="text" name="cep" value={formData.cep || ''} onChange={handleInputChange} /></div><div><label className="block text-sm font-medium text-texto-normal mb-2">Endereço</label><StyledInput type="text" name="address" value={formData.address || ''} onChange={handleInputChange} /></div><div><label className="block text-sm font-medium text-texto-normal mb-2">Bairro</label><StyledInput type="text" name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} /></div><div><label className="block text-sm font-medium text-texto-normal mb-2">Cidade</label><StyledInput type="text" name="city" value={formData.city || ''} onChange={handleInputChange} /></div><div><label className="block text-sm font-medium text-texto-normal mb-2">Estado (UF)</label><StyledInput type="text" name="state" value={formData.state || ''} onChange={handleInputChange} maxLength={2} /></div></div></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="bg-fundo-card p-8 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><Phone size={20} className="text-realce" />Contato e Redes Sociais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-texto-normal mb-2">Email de Contato Público</label><StyledInput type="email" name="contact_email" value={formData.contact_email || ''} onChange={handleInputChange} placeholder="seu@email-publico.com" /></div>
                    <div><label className="block text-sm font-medium text-texto-normal mb-2">Telefone</label><StyledInput type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-texto-normal mb-2">Website</label><StyledInput type="url" name="website_url" value={formData.website_url || ''} onChange={handleInputChange} placeholder="https://..." /></div>
                    <div><label className="block text-sm font-medium text-texto-normal mb-2">Instagram</label><StyledInput type="url" name="instagram_url" value={formData.instagram_url || ''} onChange={handleInputChange} placeholder="https://instagram.com/..." /></div>
                    <div><label className="block text-sm font-medium text-texto-normal mb-2">Facebook</label><StyledInput type="url" name="facebook_url" value={formData.facebook_url || ''} onChange={handleInputChange} placeholder="https://facebook.com/..." /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-texto-normal mb-2">LinkedIn</label><StyledInput type="url" name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." /></div>
                </div>
            </div>
        </motion.div>

        <div className="pt-2 flex justify-end">
            <button type="submit" disabled={saving || loading} className="px-6 py-3 bg-realce text-fundo-card rounded-lg font-bold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                {saving ? 'Salvando...' : 'Salvar Perfil Completo'}
            </button>
        </div>
      </form>
      
      <motion.form onSubmit={handlePasswordChange} className="bg-fundo-card p-8 rounded-2xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><KeyRound size={20} className="text-realce" />Alterar Senha</h3>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-texto-normal mb-2">Nova Senha</label><StyledInput type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" /></div>
          <div><label className="block text-sm font-medium text-texto-normal mb-2">Confirmar Nova Senha</label><StyledInput type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" /></div>
          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-[#1E1E1E] text-white rounded-lg font-medium hover:opacity-80 transition-colors disabled:opacity-50">
              {saving ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};