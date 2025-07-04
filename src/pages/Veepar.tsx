import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Star, Award, Shield, Crown, CheckCircle, Trophy, Rocket, Play, ChevronDown, MessageSquare, ArrowRight, Verified, Zap
} from 'lucide-react';

// --- DADOS DA PÁGINA (AGORA COMPLETOS) ---
const rankingFactors = [
    { id: 'plan', title: 'Plano', description: 'Seu plano determina sua visibilidade e recursos.', weight: 40, icon: Crown, color: '#DDF247', tips: ['Enterprise: Destaque máximo', 'Premium: Boa visibilidade', 'Upgrade para subir no ranking'] },
    { id: 'nps', title: 'NPS Score', description: 'Net Promoter Score baseado nos feedbacks.', weight: 25, icon: TrendingUp, color: '#22c55e', tips: ['Responda feedbacks rapidamente', 'Supere as expectativas', 'Resolva problemas proativamente'] },
    { id: 'rating', title: 'Avaliação Média', description: 'Média das estrelas recebidas dos clientes.', weight: 20, icon: Star, color: '#f59e0b', tips: ['Entregue serviços de alta qualidade', 'Peça avaliações aos clientes', 'Mantenha um padrão de excelência'] },
    { id: 'verification', title: 'Verificação', description: 'Perfil verificado aumenta a confiança.', weight: 10, icon: Verified, color: '#3b82f6', tips: ['Complete a verificação', 'Valide seus documentos', 'Mantenha dados atualizados'] },
    { id: 'activity', title: 'Atividade', description: 'Frequência de uso e engajamento.', weight: 5, icon: Zap, color: '#8b5cf6', tips: ['Acesse a plataforma regularmente', 'Responda as mensagens', 'Atualize seu perfil'] }
];

const successCases = [
    { name: 'Silva Reformas', before: 'Posição #47', after: 'Posição #1', improvement: '+4600%', actions: ['Upgrade para Enterprise', 'Melhorou NPS de 65 para 85', 'Verificou perfil'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { name: 'Beleza & Estilo', before: 'Posição #23', after: 'Posição #2', improvement: '+1050%', actions: ['Upgrade para Premium', 'Aumentou avaliação para 4.9', 'Respondeu todos feedbacks'], avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
];

const faqs = [
    { question: 'Como é calculado o ranking no Veepo?', answer: 'O ranking combina múltiplos fatores: Plano de assinatura (40%), NPS Score (25%), Avaliação média (20%), Verificação (10%) e Atividade na plataforma (5%). Cada fator contribui para sua pontuação final.' },
    { question: 'Quanto tempo leva para melhorar minha posição?', answer: 'Mudanças no plano são imediatas. Melhorias no NPS e avaliações podem levar de 1 a 4 semanas para refletir no ranking, dependendo do volume de novos feedbacks recebidos.' },
    { question: 'Posso melhorar meu ranking sem fazer upgrade do plano?', answer: 'Sim! Embora o plano tenha maior peso, você pode melhorar significativamente focando em NPS, avaliações e verificação. Muitos prestadores sobem várias posições apenas com excelência no atendimento.' }
];
// --- FIM DOS DADOS ---

export const Veepar: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const sectionAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div {...sectionAnimation} className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-realce/10">
            <Trophy className="h-10 w-10 text-realce" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white">Veepar: Como Ficar Bem Rankeado</h1>
        <p className="text-xl max-w-3xl mx-auto text-texto-normal/70">
          Descubra os segredos para aparecer no topo do Veepo e atrair mais clientes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="flex items-center justify-center gap-2 bg-realce text-fundo-card font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
            <Rocket size={18} />
            <span>Ver Meu Ranking</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-fundo-card border border-[#1E1E1E] text-realce font-bold py-3 px-6 rounded-lg hover:bg-white/5 transition-colors">
            <Play size={18} />
            <span>Ver Tutorial</span>
          </button>
        </div>
      </motion.div>

      {/* Como Funciona o Ranking */}
      <motion.div {...sectionAnimation} className="bg-fundo-card p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Como Funciona o Ranking</h2>
          <p className="text-lg text-texto-normal/70">Nosso algoritmo considera 5 fatores para determinar sua posição.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {rankingFactors.map((factor) => {
            const IconComponent = factor.icon;
            return (
              <div key={factor.id} className="bg-[#1E1E1E] p-6 rounded-xl border border-white/5 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5">
                    <IconComponent className="h-6 w-6" style={{ color: factor.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{factor.title}</h3>
                    <span className="text-sm font-medium" style={{ color: factor.color }}>{factor.weight}% do ranking</span>
                  </div>
                </div>
                <p className="text-sm mb-4 text-texto-normal/70">{factor.description}</p>
                <div className="space-y-2">
                  {factor.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: factor.color }} />
                      <span className="text-sm text-texto-normal/70">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Cases de Sucesso */}
      <motion.div {...sectionAnimation} className="bg-fundo-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Cases de Sucesso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {successCases.map((case_, index) => (
            <div key={index} className="p-6 rounded-xl bg-realce/5 border border-realce/20">
              <div className="flex items-center gap-4 mb-4">
                <img src={case_.avatar} alt={case_.name} className="w-16 h-16 rounded-full object-cover border-2 border-realce" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{case_.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-texto-normal/80">
                    <span>{case_.before}</span>
                    <ArrowRight size={16} className="text-realce" />
                    <span className="font-medium text-realce">{case_.after}</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{case_.improvement} melhoria</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-white">Ações realizadas:</h4>
                {case_.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-green-400" />
                    <span className="text-sm text-texto-normal/70">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div {...sectionAnimation} className="bg-fundo-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Perguntas Frequentes</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-white/10">
              <button onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)} className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors">
                <span className="font-medium text-white">{faq.question}</span>
                <span className={`transition-transform duration-300 ${expandedFAQ === index ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-5 w-5 text-realce" />
                </span>
              </button>
              {expandedFAQ === index && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 border-t border-white/10">
                  <p className="text-texto-normal/80">{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Final */}
      <motion.div {...sectionAnimation} className="bg-realce/10 border border-realce/20 text-center p-8 rounded-2xl">
        <Trophy className="h-12 w-12 mx-auto mb-4 text-realce" />
        <h2 className="text-2xl font-bold mb-4 text-white">Pronto para Dominar o Veepo?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-texto-normal/80">
          Aplique essas estratégias e veja seu negócio crescer. Melhore seu ranking para atrair mais clientes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center gap-2 bg-realce text-fundo-card font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
            <Crown size={18} />
            <span>Ver Meus Planos</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-fundo-card border border-[#1E1E1E] text-realce font-bold py-3 px-6 rounded-lg hover:bg-white/5 transition-colors">
            <MessageSquare size={18} />
            <span>Falar com Suporte</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};