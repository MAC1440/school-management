import React from 'react';
import { Award, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { SchoolStats } from '../../types';

interface KpiCardsProps {
  stats: SchoolStats | null;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex justify-between items-center text-muted-foreground mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Average Campus GPA</span>
          <Award className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-extrabold text-foreground">{stats?.averageGpa || 3.68}</div>
        <p className="text-[10px] text-emerald-600 font-medium mt-1">+0.12 vs last semester</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex justify-between items-center text-muted-foreground mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Overall Attendance</span>
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="text-2xl font-extrabold text-foreground">{stats?.attendanceRate || 95.4}%</div>
        <p className="text-[10px] text-muted-foreground font-medium mt-1">High engagement campus-wide</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex justify-between items-center text-muted-foreground mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Students</span>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="text-2xl font-extrabold text-foreground">{stats?.totalStudents || 850}</div>
        <p className="text-[10px] text-muted-foreground font-medium mt-1">Across active courses</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <div className="flex justify-between items-center text-muted-foreground mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">At-Risk Intervention</span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-extrabold text-amber-600">{stats?.atRiskStudentsCount || 4} Students</div>
        <p className="text-[10px] text-amber-600/80 font-medium mt-1">Grade below 75% or attendance &lt;85%</p>
      </div>
    </div>
  );
};
