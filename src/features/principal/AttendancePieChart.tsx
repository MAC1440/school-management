import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Users } from 'lucide-react';

interface AttendancePieChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

export const AttendancePieChart: React.FC<AttendancePieChartProps> = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
      <div className="flex justify-between items-center pb-3 border-b border-border">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          Attendance Breakdown
        </h3>
        <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold">Today's Ratio</span>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: 'var(--color-foreground)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-muted-foreground pt-2 border-t border-border">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}: <strong>{item.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
};
