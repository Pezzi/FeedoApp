// src/pages/BillingPage.tsx

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import { Crown, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

import { PlanCard } from '../components/billing/PlanCard';
import { BillingPageSkeleton } from '../components/billing/BillingPageSkeleton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    name: 'Free',
    icon: Shield,
    features: ['1 QR Code', '100 Scans/mês', 'Dashboard Básico', 'Suporte da Comunidade'],
    pricing: {
      monthly: { price: 'R$ 0', priceId: 'free' },
      annually: { price: 'R$ 0', priceId: 'free' },
    },
  },
  {
    name: 'Feedo Pro',
    icon: Award,
    isFeatured: true,
    features: ['10 QR Codes', '5.000 Scans/mês', 'Dashboard Avançado', 'Suporte Prioritário'],
    pricing: {
      monthly: { price: 'R$ 79', priceId: 'price_1P5qMHBrqJeZRdGh07iCgklt' },
      annually: { price: 'R$ 790', priceId: 'price_1P5qNLBrqJeZRdGhXS3G2PMg' },
    },
  },
  {
    name: 'Feedo Master',
    icon: Crown,
    features: ['Feedbacks ilimitados', 'QR Codes ilimitados', 'API de integração', 'Suporte Dedicado'],
    pricing: {
      monthly: { price: 'R$ 199', priceId: 'price_1P5qOvBrqJeZRdGhwALwBSCD' },
      annually: { price: 'R$ 1.990', priceId: 'price_1P5qORBrqJeZRdGhVG2Q1eZm' },
    },
  }
];

const useSubscription = () => {
    const [subscription, setSubscription] = useState({ plan: 'Free', loading: true });
    useEffect(() => {
        setTimeout(() => setSubscription({ plan: 'Free', loading: false }), 1000);
    }, []);
    return subscription;
}

export const BillingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const { plan: currentPlan, loading: loadingSubscription } = useSubscription();

  const handleCheckout = async (priceId: string) => {
    if (priceId === 'free') return; // Não faz nada se o priceId for do plano free

    setLoadingPriceId(priceId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', { body: { priceId } });
      if (error) throw new Error(error.message);
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar o pagamento. Tente novamente.");
    } finally {
      setLoadingPriceId(null);
    }
  };
  
  if (loadingSubscription) {
    return <BillingPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <h1 className="text-3xl font-bold text-realce">Planos Flexíveis para seu Sucesso</h1>
        <p className="text-lg text-texto-normal/70 mt-2">Escolha o plano que melhor se adapta ao crescimento do seu negócio.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex justify-center">
        <div className="bg-fundo-card p-1 rounded-lg flex items-center gap-2">
          <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'bg-realce text-fundo-card' : 'text-texto-normal hover:bg-white/5'}`}>Mensal</button>
          <button onClick={() => setBillingCycle('annually')} className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors relative ${billingCycle === 'annually' ? 'bg-realce text-fundo-card' : 'text-texto-normal hover:bg-white/5'}`}>
            Anual
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs rounded-full bg-realce/30 text-realce font-semibold">ECONOMIZE</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="h-full"
          >
            <PlanCard 
              plan={plan}
              billingCycle={billingCycle}
              onCheckout={handleCheckout}
              isLoading={loadingPriceId === plan.pricing.monthly.priceId || loadingPriceId === plan.pricing.annually.priceId}
              isCurrentPlan={currentPlan === plan.name}
            />
          </motion.div>
        ))}
      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="text-center text-xs text-texto-normal/60 pt-4">
        <p>Dúvidas? Entre em contato com nosso suporte. O cancelamento pode ser feito a qualquer momento.</p>
      </motion.div>
    </div>
  );
};