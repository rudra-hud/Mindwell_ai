
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Mood } from '../types';
import { MOOD_COLORS } from '../constants';

interface CorrelationChartProps {
  data: { activity: string; [mood: string]: number | string }[];
}

const moods: Mood[] = ['Joyful', 'Calm', 'Sad', 'Anxious', 'Angry', 'Neutral'];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 capitalize">{label}</p>
          <ul className="space-y-1">
            {payload.sort((a: any, b: any) => b.value - a.value).map((p: any) => (
              <li key={p.dataKey} className="flex items-center">
                <div style={{width: 10, height: 10, backgroundColor: p.color, marginRight: 8, display: 'inline-block', borderRadius: '50%'}}></div>
                <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{p.dataKey}: </span>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">{p.value}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
};

const CorrelationChart: React.FC<CorrelationChartProps> = ({ data }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tickColor = isDarkMode ? '#94a3b8' : '#64748b'; // slate-400 or slate-500
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0'; // slate-700 or slate-200

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.6}/>
        <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
        <YAxis 
            type="category" 
            dataKey="activity"
            tick={{ fontSize: 12, fill: tickColor }}
            width={80}
            stroke={tickColor}
            />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}/>
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
        {moods.map(mood => (
            <Bar 
                key={mood} 
                dataKey={mood} 
                stackId="a" 
                fill={isDarkMode ? MOOD_COLORS[mood].dark : MOOD_COLORS[mood].light}
                radius={[0, 4, 4, 0]}
                />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CorrelationChart;
