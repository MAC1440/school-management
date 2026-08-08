import React from 'react';
import { User, Course } from '../../types';
import { BookOpen, Building2 } from 'lucide-react';

interface TeacherProfileProps {
  teacherUser: User;
  courses: Course[];
  totalAttended: number;
  totalWorkingDays: number;
  netSalary: number;
  deductions: number;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({
  teacherUser,
  courses,
  totalAttended,
  totalWorkingDays,
  netSalary,
  deductions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="text-center">
          <img
            src={teacherUser.avatar}
            alt={teacherUser.name}
            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary mb-3 shadow-md"
          />
          <h2 className="font-bold text-foreground text-lg">{teacherUser.name}</h2>
          <p className="text-xs text-muted-foreground">{teacherUser.department || 'Faculty Member'}</p>
        </div>

        <div className="pt-4 border-t border-border space-y-2 text-xs text-foreground">
          <p className="flex justify-between">
            <span className="text-muted-foreground">Campus Branch:</span>
            <strong>{teacherUser.branchName || 'Main Campus'}</strong>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Staff PIN Code:</span>
            <strong className="font-mono text-primary">{teacherUser.pin || '1234'}</strong>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Assigned Courses:</span>
            <strong>{courses.length}</strong>
          </p>
        </div>
      </div>

      <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-foreground text-base mb-1">Monthly Salary & Working Days Summary</h3>
          <p className="text-xs text-muted-foreground">
            Tracked directly from your Kiosk staff check-in logs and institutional calendar parameters.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-surface border border-border rounded-xl text-center">
            <div className="text-lg font-bold text-foreground">${teacherUser.baseSalary || 4500}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Base Salary</div>
          </div>
          <div className="p-3 bg-surface border border-border rounded-xl text-center">
            <div className="text-lg font-bold text-emerald-600">{totalAttended} / {totalWorkingDays}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Days Attended</div>
          </div>
          <div className="p-3 bg-surface border border-border rounded-xl text-center">
            <div className="text-lg font-bold text-rose-600">-${deductions}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Absence Penalty</div>
          </div>
          <div className="p-3 bg-surface border border-border rounded-xl text-center">
            <div className="text-lg font-bold text-primary">${netSalary}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Net Salary</div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            My Active Assigned Classes
          </h4>
          <div className="flex flex-wrap gap-2">
            {courses.map((c) => (
              <span key={c.id} className="px-3 py-1 bg-surface-2 border border-border rounded-xl text-xs font-semibold text-foreground">
                {c.name} ({c.gradeLevel})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
