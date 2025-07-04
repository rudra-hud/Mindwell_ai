
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { JournalEntry, Mood } from '../types';
import { MOOD_COLORS } from '../constants';

interface MoodChartProps {
  data: JournalEntry[];
}

const moodToValue: Record<Mood, number> = {
  Angry: 1,
  Anxious: 2,
  Sad: 3,
  Neutral: 4,
  Calm: 5,
  Joyful: 6,
};

const valueToMood: Record<number, Mood> = {
  1: 'Angry',
  2: 'Anxious',
  3: 'Sad',
  4: 'Neutral',
  5: 'Calm',
  6: 'Joyful',
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const mood: Mood = data.mood;
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{`Date: ${label}`}</p>
        <p className="text-sm" style={{ color: MOOD_COLORS[mood].dark }}>{`Mood: ${mood}`}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">"{data.userContent.substring(0, 50)}..."</p>
      </div>
    );
  }
  return null;
};

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(entry => ({
      ...entry,
      moodValue: moodToValue[entry.mood],
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} className="stroke-slate-300 dark:stroke-slate-700"/>
        <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            className="fill-slate-500 dark:fill-slate-400"
            />
        <YAxis 
            domain={[0, 7]} 
            ticks={[1, 2, 3, 4, 5, 6]} 
            tickFormatter={(value) => valueToMood[value] || ''}
            tick={{ fontSize: 10, width: 80 }} 
            className="fill-slate-500 dark:fill-slate-400"
            />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px' }} 
          formatter={(value, entry) => {
              const { color } = entry;
              return <span style={{ color }}>{value}</span>;
          }}
        />
        <Line 
            type="monotone" 
            dataKey="moodValue" 
            name="Mood"
            stroke={MOOD_COLORS.Calm.dark} 
            strokeWidth={2}
            dot={(props) => {
                const { cx, cy, payload } = props;
                return <circle cx={cx} cy={cy} r={4} fill={MOOD_COLORS[payload.mood].dark} stroke={MOOD_COLORS[payload.mood].light} strokeWidth={2}/>
            }}
            activeDot={(props) => {
                const { cx, cy, payload } = props;
                return <circle cx={cx} cy={cy} r={6} fill={MOOD_COLORS[payload.mood].dark} stroke="white" strokeWidth={2}/>
            }}
            />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodChart;
