import React from 'react';
import { Course, GradeRecord } from '../../types';
import { Award, Printer } from 'lucide-react';

interface GradeSummaryProps {
  gradesByCourse: Array<{
    course: Course;
    grades: GradeRecord[];
    averagePct: number;
    letterGrade: string;
  }>;
  cumulativeGpa: number;
  totalPercentage: number;
  onPrintReportCard: () => void;
}

export const GradeSummary: React.FC<GradeSummaryProps> = ({
  gradesByCourse,
  cumulativeGpa,
  totalPercentage,
  onPrintReportCard,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Cumulative GPA</p>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{cumulativeGpa.toFixed(2)}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Overall Average</p>
          <div className="text-3xl font-extrabold text-foreground mt-1">{totalPercentage}%</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Academic Report</p>
            <p className="text-xs font-bold text-foreground mt-1">Official Transcript</p>
          </div>
          <button
            onClick={onPrintReportCard}
            className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all flex items-center gap-1 text-xs font-bold"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gradesByCourse.map(({ course, grades, averagePct, letterGrade }) => (
          <div key={course.id} className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-start pb-2 border-b border-border">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-primary font-bold">{course.code}</span>
                <h4 className="font-bold text-foreground text-sm mt-1">{course.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-600">{letterGrade}</span>
                <p className="text-[10px] text-muted-foreground">{averagePct}% Average</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {grades.map((g) => (
                <div key={g.id} className="flex justify-between items-center text-xs p-2 bg-surface rounded-xl">
                  <span className="font-medium text-foreground">{g.title}</span>
                  <span className="font-mono font-bold text-primary">{g.score} / {g.maxScore}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
