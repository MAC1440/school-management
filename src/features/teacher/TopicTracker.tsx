import React from 'react';
import { TopicPlan } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TopicTrackerProps {
  courseName?: string;
  topicPlans: TopicPlan[];
  onToggleTopic: (topicId: string) => void;
}

export const TopicTracker: React.FC<TopicTrackerProps> = ({
  courseName = 'Selected Class',
  topicPlans,
  onToggleTopic,
}) => {
  const completedCount = topicPlans.filter((t) => t.isCompleted).length;
  const progressPercent = topicPlans.length > 0 ? Math.round((completedCount / topicPlans.length) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-foreground text-sm">
            Curriculum Topic Progress Tracker — {courseName}
          </h3>
          <p className="text-xs text-muted-foreground">Compare daily planned vs actual covered topics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">{progressPercent}% Syllabus Covered</span>
          <div className="w-24 bg-surface-2 h-2.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {topicPlans.map((topic) => (
          <div
            key={topic.id}
            onClick={() => onToggleTopic(topic.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              topic.isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground'
                : 'bg-surface border-border hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center space-x-3">
              {topic.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div>
                <p className={`text-xs font-bold ${topic.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {topic.topicTitle}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Planned Date: {topic.plannedDate} • Duration: {topic.durationMinutes} mins
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              topic.isCompleted ? 'bg-emerald-600 text-white' : 'bg-surface-2 text-muted-foreground'
            }`}>
              {topic.isCompleted ? 'Covered' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
