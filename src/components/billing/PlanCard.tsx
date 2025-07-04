// src/components/billing/PlanCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';

// Tipagem para os dados de um plano específico
interface Plan {
  name: string;
  icon: React.ElementType;
  isFeatured?: boolean;
  features: string[];
  pricing: {
    monthly: { price: string; priceId: string };
    annually: { price: string; priceId: string };
  };
}

// Tipagem para as props do nosso componente
interface PlanCardProps {
  plan: Plan;
  billingCycle: 'monthly' | 'annually';
  onCheckout: (priceId: string) => void;
  isLoading: boolean;
  isCurrentPlan: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, billingCycle, onCheckout, isLoading, isCurrentPlan }) => {
  const navigate = useNavigate();
  const currentPricing = plan.pricing[billingCycle];
  const isFreePlan = plan.name === 'Free';

  // Função que decide o que fazer ao clicar no botão
  const handleButtonClick = () => {
    if (isFreePlan) {
      // Se for o plano gratuito, navega para o dashboard
      navigate('/dashboard');
    } else {
      // Para outros planos, chama a função de checkout
      onCheckout(currentPricing.priceId);
    }
  };

  // Função para definir o texto do botão
  const getButtonText = () => {
    if (isLoading) return 'Aguarde...';
    if (isCurrentPlan) return 'Seu Plano Atual';
    if (isFreePlan) return 'Começar Grátis';
    return 'Fazer Upgrade';
  };

  const cardClasses = `
    bg-fundo-card rounded-2xl p-8 flex flex-col h-full
    ${plan.isFeatured ? 'border-2 border-realce shadow-2xl' : 'border border-[#1E1E1E]'}
  `;

  const buttonClasses = `
    w-full py-3 mt-auto rounded-lg font-bold transition-all flex items-center justify-center gap-2
    disabled:opacity-60 disabled:cursor-not-allowed
    ${isCurrentPlan ? 'bg-[#1E1E1E] text-texto-normal/70 cursor-default' : 
     plan.isFeatured ? 'bg-realce text-fundo-card hover:opacity-90' : 
     'bg-white/10 text-white hover:bg-white/20'
    }
  `;

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-3 mb-4">
        <plan.icon className={`h-8 w-8 ${plan.isFeatured ? 'text-realce' : 'text-texto-normal/70'}`} />
        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
      </div>
      <p className="text-4xl font-bold text-white mb-6">
        {currentPricing.price}
        {!isFreePlan && <span className="text-base font-medium text-texto-normal/70">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>}
      </p>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-center gap-3">
            <Check className="h-5 w-5 text-realce flex-shrink-0" />
            <span className="text-texto-normal">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={handleButtonClick}
        disabled={isLoading || isCurrentPlan}
        className={buttonClasses}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {getButtonText()}
      </button>
    </div>
  );
};