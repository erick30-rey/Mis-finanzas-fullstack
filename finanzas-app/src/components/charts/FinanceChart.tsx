import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

import {
  Doughnut,
  Bar,
  Line,
  PolarArea
} from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler
);

interface Props {
  labels: string[];
  values: number[];
  colors: string[];
  centerText?: string;
  type: 'income' | 'expense';
  variant?: 'doughnut' | 'bar' | 'line' | 'polar';
}

const FinanceChart: React.FC<Props> = ({
  labels,
  values,
  colors,
  centerText,
  type,
  variant = 'doughnut'
}) => {
  const mainColor = type === 'income' ? '#22c55e' : '#ef4444';
  const accentColor = type === 'income' ? '#4ade80' : '#f87171';

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: variant === 'line' ? accentColor + '40' : colors,
        borderColor: variant === 'line' ? accentColor : mainColor,
        pointBackgroundColor: mainColor,
        pointBorderColor: '#0b1120',
        pointBorderWidth: 2,
        pointRadius: variant === 'line' ? 4 : 0,
        pointHoverRadius: 6,
        borderWidth: 3,
        borderRadius: variant === 'bar' ? 12 : 0,
        tension: 0.45,
        fill: variant === 'line',
        maxBarThickness: 38,
        categoryPercentage: 0.8,
        barPercentage: 0.8
      }
    ]
  }), [labels, values, colors, mainColor, accentColor, variant]);

  const baseOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 12 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx: any) => `RD$ ${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 12 } }
      },
      y: {
        grid: {
          color: 'rgba(148,163,184,0.18)',
          borderDash: [4, 4]
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 12 },
          callback: (value: any) => `RD$ ${value}`
        }
      }
    }
  };

  const doughnutOptions = {
    ...baseOptions,
    cutout: '70%',
    plugins: {
      ...baseOptions.plugins,
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
          label: (ctx: any) => `${ctx.label}: RD$ ${ctx.raw?.toLocaleString()}`
        }
      }
    }
  };

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart: any) {
      if (!centerText) return;

      const ctx = chart.ctx || (chart as any).chart.ctx;
      const area = chart.chartArea || (chart as any).chartArea;

      const centerX = area ? (area.left + area.right) / 2 : (chart.width || 0) / 2;
      const centerY = area ? (area.top + area.bottom) / 2 : (chart.height || 0) / 2;

      ctx.save();
      // start with a reasonable font size and shrink if needed to fit
      let fontSize = 20;
      ctx.font = `700 ${fontSize}px system-ui`;
      const text = String(centerText);
      const maxWidth = area ? (area.right - area.left) : (chart.width || 0);

      while (maxWidth && ctx.measureText(text).width > maxWidth * 0.72 && fontSize > 10) {
        fontSize -= 1;
        ctx.font = `700 ${fontSize}px system-ui`;
      }

      ctx.fillStyle = mainColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    }
  };

  return (
    <div style={{ height: 280, width: '100%', minHeight: 240, maxWidth: '100%' }}>
      {variant === 'doughnut' && (
        <Doughnut
          key={type}
          data={data}
          options={doughnutOptions}
          plugins={[centerTextPlugin]}
        />
      )}

      {variant === 'bar' && (
        <Bar data={data} options={baseOptions} />
      )}

      {variant === 'line' && (
        <Line data={data} options={baseOptions} />
      )}

      {variant === 'polar' && (
        <PolarArea data={data} options={baseOptions} />
      )}
    </div>
  );
};

export default FinanceChart;
