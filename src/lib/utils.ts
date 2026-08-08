import { GradeRecord, AttendanceRecord } from '../types';

export function calculateGradePercentage(scores: GradeRecord[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0);
  return Math.round(total / scores.length);
}

export function percentageToLetterGrade(pct: number): string {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 80) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 65) return 'D';
  return 'F';
}

export function percentageToGpa(pct: number): number {
  if (pct >= 93) return 4.0;
  if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0;
  if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0;
  if (pct >= 70) return 1.7;
  if (pct >= 65) return 1.0;
  return 0.0;
}

export function calculateAttendancePercentage(records: AttendanceRecord[]): number {
  if (records.length === 0) return 100;
  const presentCount = records.filter((r) => r.status === 'present' || r.status === 'tardy').length;
  return Math.round((presentCount / records.length) * 100);
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'present':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'tardy':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'absent':
      return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    case 'excused':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    default:
      return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  }
}

export function getCourseColorClass(colorName: string): { bg: string; text: string; border: string; accent: string } {
  switch (colorName) {
    case 'emerald':
      return { bg: 'bg-emerald-50 text-emerald-900', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' };
    case 'blue':
      return { bg: 'bg-blue-50 text-blue-900', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' };
    case 'purple':
      return { bg: 'bg-purple-50 text-purple-900', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500' };
    case 'amber':
      return { bg: 'bg-amber-50 text-amber-900', text: 'text-amber-700', border: 'border-amber-200', accent: 'bg-amber-500' };
    case 'indigo':
      return { bg: 'bg-indigo-50 text-indigo-900', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-indigo-500' };
    case 'rose':
      return { bg: 'bg-rose-50 text-rose-900', text: 'text-rose-700', border: 'border-rose-200', accent: 'bg-rose-500' };
    default:
      return { bg: 'bg-sky-50 text-sky-900', text: 'text-sky-700', border: 'border-sky-200', accent: 'bg-sky-500' };
  }
}
