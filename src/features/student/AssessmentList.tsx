import React from 'react';
import { AssessmentItem } from '../../types';
import { FileText, Clock } from 'lucide-react';

interface AssessmentListProps {
  assessments: AssessmentItem[];
}

export const AssessmentList: React.FC<AssessmentListProps> = ({ assessments }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground text-base">Upcoming Exams, Quizzes & Submissions</h3>
      </div>

      <div className="space-y-3">
        {assessments.map((item) => (
          <div key={item.id} className="p-4 bg-surface border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-primary/10 text-primary border border-primary/30">
                {item.type}
              </span>
              <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground font-mono bg-surface-2 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-primary" />
              <span>Due: {item.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
