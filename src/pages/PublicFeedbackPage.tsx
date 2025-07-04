import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Send, PartyPopper, Loader2 } from 'lucide-react';
import { usePublicQRCode, useSubmitFeedback } from '../hooks/usePublicFeedback';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

// ALTERAÇÃO AQUI: As estrelas agora usam a cor 'realce'
const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex justify-center space-x-2 my-6">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className="transition-transform duration-200 hover:scale-125"
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className="h-10 w-10 text-realce" // Usando a classe de texto
              fill={ratingValue <= (hover || rating) ? 'currentColor' : 'none'} // 'currentColor' usa a cor do texto definida acima
              stroke={ratingValue <= (hover || rating) ? 'currentColor' : '#404040'}
            />
          </button>
        );
      })}
    </div>
  );
};


export const PublicFeedbackPage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const { qrCode, loading, error } = usePublicQRCode(qrCodeId);
  const { submitFeedback, submitting } = useSubmitFeedback();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warn("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
      return;
    }
    if (!qrCode || !qrCodeId) return;

    try {
      await submitFeedback(qrCodeId, qrCode.user_id, { rating, comment });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      await queryClient.invalidateQueries({ queryKey: ['nps-trend'] });
      await queryClient.invalidateQueries({ queryKey: ['recent-feedbacks'] });
      await queryClient.invalidateQueries({ queryKey: ['map-feedbacks'] });
      setIsSubmitted(true);
    } catch (err) {
      toast.error("Ocorreu um erro ao enviar seu feedback. Tente novamente.");
    }
  };

  if (loading) { /* ... (sem alterações) ... */ }
  if (error) { /* ... (sem alterações) ... */ }
  if (isSubmitted) { /* ... (sem alterações) ... */ }

  return (
    // ALTERAÇÃO AQUI: Usando as cores de fundo e texto da nossa paleta
    <div className="min-h-screen bg-fundo-principal flex flex-col items-center justify-center p-4 text-texto-normal">
       <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Deixe seu feedback</h1>
            {/* ALTERAÇÃO AQUI: Destaque com a cor 'realce' */}
            <p className="text-lg text-gray-400 mt-2">para <span className="font-bold text-realce">{qrCode?.business_name || qrCode?.name}</span></p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="p-8 rounded-lg space-y-6 bg-fundo-card" // Usando bg-fundo-card
        >
          <div>
            <label className="block text-center text-lg font-medium text-gray-300 mb-2">Qual sua nota para o serviço?</label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
              Deixe um comentário (opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Conte-nos mais sobre sua experiência..."
              className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-realce focus:border-transparent resize-none"
            />
          </div>
          
          <div className="pt-2">
            {/* ALTERAÇÃO PRINCIPAL: O botão agora usa a cor de 'realce' */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-realce text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="animate-spin h-5 w-5"/> Enviando...</> : <><Send className="h-5 w-5"/> Enviar Feedback</>}
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-600 mt-6">
          Powered by <span className="font-bold text-gray-500 hover:text-realce">Feedo</span>
        </p>
       </div>
    </div>
  );
};