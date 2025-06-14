
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsChartProps {
  data: { name: string; value: number }[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const primaryColor = 'hsl(var(--primary))'; // Use Tailwind primary color
  // const orangeColor = '#F97316'; // Tailwind orange-500 - No longer needed for specific month highlight

  // If data is empty or not provided, render a placeholder or empty state
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center text-gray-500">
        No data available for chart.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fontSize: 12, fill: '#6B7280' }} />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => Number.isInteger(value) ? `${value}` : ''} // Show only whole numbers
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6B7280' }} 
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)'}}
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
            {data.map((entry, index) => (
              // Use primaryColor for all bars
              <Cell key={`cell-${index}`} fill={primaryColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;

