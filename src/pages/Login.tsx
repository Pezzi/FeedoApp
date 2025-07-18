// src/pages/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../services/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        setError(signInError.message);
        throw signInError;
      }
      
      if (data.user) {
        console.log('✅ Login bem-sucedido, redirecionando para o dashboard...');
        navigate('/dashboard');
      }
      
    } catch (err: any) {
      console.error('Erro no processo de login:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#161616' }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(1deg); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #161616 inset !important;
          -webkit-text-fill-color: #DDF247 !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
        input::placeholder {
          color: rgba(221, 242, 71, 0.6) !important;
        }
      `}</style>
      
      {/* Seus ícones flutuantes (QR Codes) aqui */}

      <div 
        className="w-full max-w-md p-8 rounded-lg backdrop-blur-md relative z-10"
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.8)', 
          border: '1px solid rgba(221, 242, 71, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(221, 242, 71, 0.2)' }}>
            <User className="h-8 w-8" style={{ color: '#DDF247' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#fff' }}>
            Bem-vindo de volta
          </h1>
          <p className="text-sm" style={{ color: '#7A798A' }}>
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F2F2F2' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#DDF247' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full pl-10 pr-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 bg-transparent" style={{ border: '1px solid #DDF247', color: '#DDF247' }} onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(221, 242, 71, 0.2)'} onBlur={(e) => e.currentTarget.style.boxShadow = 'none'} placeholder="seu@email.com"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F2F2F2' }}>Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#DDF247' }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full pl-10 pr-12 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 bg-transparent" style={{ border: '1px solid #DDF247', color: '#DDF247' }} onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(221, 242, 71, 0.2)'} onBlur={(e) => e.currentTarget.style.boxShadow = 'none'} placeholder="Sua senha"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: '#DDF247' }}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#DDF247', color: '#161616' }} onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#c9d63b')} onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#DDF247')}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 h-px" style={{ backgroundColor: '#2a2a2a' }}></div>
          <span className="px-4 text-sm" style={{ color: '#7A798A' }}>ou continue</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#2a2a2a' }}></div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button type="button" className="flex items-center justify-center p-3 rounded-lg transition-colors" style={{ border: '1px solid rgba(221, 242, 71, 0.3)', color: '#DDF247' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(221, 242, 71, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><GoogleIcon /></button>
          <button type="button" className="flex items-center justify-center p-3 rounded-lg transition-colors" style={{ border: '1px solid rgba(221, 242, 71, 0.3)', color: '#DDF247' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(221, 242, 71, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><AppleIcon /></button>
          <button type="button" className="flex items-center justify-center p-3 rounded-lg transition-colors" style={{ border: '1px solid rgba(221, 242, 71, 0.3)', color: '#DDF247' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(221, 242, 71, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><InstagramIcon /></button>
        </div>

        <div className="text-center">
          <p className="text-sm" style={{ color: '#7A798A' }}>
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium hover:underline transition-all" style={{ color: '#DDF247' }}>
              Criar conta
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm transition-colors"
            style={{ color: '#7A798A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#DDF247';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#7A798A';
            }}
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </div>
  );
};