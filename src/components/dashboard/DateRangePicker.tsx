import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      setIsOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        id="date"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[260px] justify-start text-left font-normal bg-fundo-card text-texto-normal border-transparent hover:opacity-80 flex items-center p-2 rounded-lg transition-opacity"
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-realce" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
            </>
          ) : (
            format(date.from, 'dd/MM/yyyy')
          )
        ) : (
          <span className="text-texto-normal/70">Selecione um período</span>
        )}
      </button>

      {isOpen && (
        // BORDA CORRIGIDA PARA USAR SUA COR ESPECÍFICA #1E1E1E
        <div className="absolute top-full mt-2 z-10 right-0 rounded-xl shadow-lg p-4 border border-[#1E1E1E] bg-fundo-card/60 backdrop-blur-lg">
            <DayPicker
              mode="range"
              selected={date}
              onSelect={handleSelect}
              locale={ptBR}
              numberOfMonths={2}
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-bold text-realce',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-realce',
                head_row: 'flex',
                head_cell: 'text-texto-normal/80 rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative text-texto-normal [&:has([aria-selected])]:bg-realce/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal hover:bg-realce/10 rounded-md',
                day_selected: 'bg-realce text-fundo-card hover:bg-realce hover:text-fundo-card focus:bg-realce focus:text-fundo-card rounded-md',
                day_today: 'text-realce',
                day_range_middle: 'aria-selected:bg-realce/20 aria-selected:text-texto-normal rounded-none',
                day_hidden: 'invisible',
              }}
            />
        </div>
      )}
    </div>
  );
}