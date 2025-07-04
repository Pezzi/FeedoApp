// src/components/forms/StyledDatePicker.tsx

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface StyledDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder: string;
}

export const StyledDatePicker: React.FC<StyledDatePickerProps> = ({ date, setDate, placeholder }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full justify-start text-left font-normal flex items-center
                     bg-[#1E1E1E] border border-transparent text-texto-normal 
                     rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-realce/50"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-texto-normal/70" />
          {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : <span className="text-texto-normal/70">{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={ptBR}
          className="p-3 bg-fundo-card" // Garante o fundo do calendário
          classNames={{
            // --- ESTILOS REVISADOS E COMPLETOS AQUI ---
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-bold text-realce',
            
            // Estilo para as setas de navegação (corrigido)
            nav_button: 'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-realce rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-realce/50',
            
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-texto-normal/80 rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'h-9 w-9 text-center text-sm p-0 relative',
            
            // Estilo para os dias (corrigido)
            day: 'h-9 w-9 p-0 font-normal rounded-md transition-colors hover:bg-realce/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-realce',
            day_today: 'text-realce font-extrabold', // Dia de hoje fica em verde e negrito
            day_selected: 'bg-realce text-fundo-card hover:bg-realce hover:text-fundo-card focus:bg-realce focus:text-fundo-card',
            
            day_outside: 'text-texto-normal/50 opacity-50',
            day_disabled: 'text-texto-normal/50 opacity-50',
            day_range_middle: '',
            day_hidden: 'invisible',
          }}
        />
      </PopoverContent>
    </Popover>
  );
};