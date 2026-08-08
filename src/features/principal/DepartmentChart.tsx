import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface DepartmentChartProps {
  data: Array<{ name: string; gpa: number; attendance: number }>;
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-border">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          Academic Department GPA Overview
        </h3>
        <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold">Live Term Metrics</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} />
            <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: 'var(--color-foreground)',
              }}
            />
            <Bar dataKey="gpa" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
