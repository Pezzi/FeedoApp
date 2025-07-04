import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface BenchmarkCardProps {
  title: string;
  icon: React.ElementType;
  userValue: number | null | undefined;
  benchmarkValue: number | null | undefined;
  loading: boolean;
  unit?: string;
  format?: 'decimal' | 'integer';
}

const formatValue = (value: number | null | undefined, format: 'decimal' | 'integer') => {
  if (value === null || typeof value === 'undefined') return '...';
  if (format === 'decimal') return value.toFixed(1);
  return Math.round(value).toString();
};

export const BenchmarkCard: React.FC<BenchmarkCardProps> = ({
  title,
  icon: Icon,
  userValue,
  benchmarkValue,
  loading,
  unit = '',
  format = 'decimal',
}) => {
  const userFormatted = loading ? '...' : `${formatValue(userValue, format)}${unit}`;
  const benchmarkFormatted = loading ? '...' : `${formatValue(benchmarkValue, format)}${unit}`;

  const difference = (userValue ?? 0) - (benchmarkValue ?? 0);
  
  let ComparisonIcon = Minus;
  let comparisonColor = 'text-gray-400';
  let comparisonText = `Igual à média do setor (${benchmarkFormatted})`;

  if (!loading && benchmarkValue !== null && typeof benchmarkValue !== 'undefined') {
    if (difference > 0.05) { // Uma pequena margem para não mostrar "acima" por diferenças mínimas
      ComparisonIcon = ArrowUp;
      comparisonColor = 'text-green-400';
      comparisonText = `Acima da média do setor (${benchmarkFormatted})`;
    } else if (difference < -0.05) {
      ComparisonIcon = ArrowDown;
      comparisonColor = 'text-red-400';
      comparisonText = `Abaixo da média do setor (${benchmarkFormatted})`;
    }
  }

  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: '#232323' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-400">{title}</p>
        <Icon className="h-6 w-6 text-gray-500" />
      </div>
      <p className="text-3xl font-bold text-white mb-2">{userFormatted}</p>
      <div className={`flex items-center text-xs gap-1 ${comparisonColor}`}>
        <ComparisonIcon className="h-3 w-3" />
        <span>{loading ? 'Carregando benchmark...' : comparisonText}</span>
      </div>
    </div>
  );
};
