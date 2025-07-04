// src/components/dashboard/NpsLineChart.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // 1. IMPORTAMOS O 'FILLER' PARA O PREENCHIMENTO
} from 'chart.js';
interface NpsTrendData {
  day: string;
  nps_score: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // 2. REGISTAMOS O 'FILLER'
);

interface NpsLineChartProps {
  chartData: NpsTrendData[];
}

export const NpsLineChart: React.FC<NpsLineChartProps> = ({ chartData }) => {
  const data = {
    labels: chartData.map(d => d.day),
    datasets: [
      {
        label: 'NPS',
        data: chartData.map(d => d.nps_score),
        borderColor: 'rgba(255, 22, 250, 1)',
        borderWidth: 2.5, // Deixando a linha um pouco mais espessa
        
        // --- A MÁGICA DO GRADIENTE ACONTECE AQUI ---
        fill: true, // Habilitamos o preenchimento
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          if (!ctx) return null;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height); // Gradiente vertical
          gradient.addColorStop(0, 'rgba(255, 22, 250, 0.4)');   // Cor inicial (mais opaca)
          gradient.addColorStop(1, 'rgba(255, 22, 250, 1)');    // Cor final (transparente)
          return gradient;
        },
        // --- FIM DA MÁGICA ---

        tension: 0.4,
        pointRadius: 0, // Escondemos os pontos normais
        pointHoverRadius: 6, // Mostramos um ponto maior no hover
        pointBackgroundColor: '#A8FF36',
        pointBorderColor: '#1E1E1E',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -100,
        max: 100,
        ticks: { color: '#EDEDED', font: { size: 12 } },
        grid: { color: '#303030' },
        // Adicionando uma borda para 'definir' melhor o eixo
        border: { display: true, color: '#303030' } 
      },
      x: {
        ticks: { color: '#EDEDED', font: { size: 12 } },
        grid: { display: false }, // Removemos o grid vertical para um look mais limpo
        border: { display: true, color: '#303030' }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            color: '#EDEDED'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E1E1E',
        titleColor: '#EDEDED',
        bodyColor: '#A8FF36',
        borderColor: '#303030',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
  };

  return <Line options={options} data={data} />;
};