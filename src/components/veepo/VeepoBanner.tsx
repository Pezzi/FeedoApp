// ARQUIVO: src/components/veepo/VeepoBanner.tsx

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const VeepoBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-fundo-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-lg border border-[#1E1E1E] overflow-hidden"
    >
      <div className="md:w-3/5 text-center md:text-left mb-8 md:mb-0 z-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
          Conhece um ótimo prestador de serviço?
        </h2>
        <p className="text-texto-normal/80 text-base lg:text-lg max-w-md">
          Ajude nossa comunidade a crescer. Indique um profissional ou empresa agora mesmo!
        </p>
        <motion.a
          href="/indicar-prestador"
          className="inline-flex items-center bg-realce text-fundo-card font-bold py-3 px-5 rounded-lg mt-8 hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Indicar Prestador
          <ArrowUpRight className="ml-2" size={20} />
        </motion.a>
      </div>

      <motion.div 
        className="md:w-2/5 flex justify-center md:justify-end z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img
          src="/images/banner-veepo.svg" 
          alt="Ilustração de pessoas conectadas"
          className="w-48 h-48 md:w-64 md:h-64"
        />
      </motion.div>
      
      <div className="absolute -bottom-1/4 -right-16 w-72 h-72 bg-realce/5 rounded-full blur-3xl -z-0"></div>
    </motion.div>
  );
};