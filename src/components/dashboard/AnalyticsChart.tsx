
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 7500 },
  { name: 'Apr', value: 10000 },
  { name: 'May', value: 4500 },
  { name: 'Jun', value: 1200 },
  { name: 'Jul', value: 800 },
  { name: 'Aug', value: 1500 },
  { name: 'Sep', value: 3200 },
  { name: 'Oct', value: 2800 },
  { name: 'Nov', value: 4100 },
  { name: 'Dec', value: 3500 },
];

const AnalyticsChart = () => {
  const primaryColor = 'hsl(var(--primary))'; // Use Tailwind primary color
  const orangeColor = '#F97316'; // Tailwind orange-500

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fontSize: 12, fill: '#6B7280' }} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}K`} tick={{ fontSize: 12, fill: '#6B7280' }} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)'}}
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
            {data.map((entry, index) => (
              // Highlight 'May' as per previous logic
              <Cell key={`cell-${index}`} fill={entry.name === 'May' ? orangeColor : primaryColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
