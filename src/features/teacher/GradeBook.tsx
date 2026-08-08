import React, { useState } from 'react';
import { User, GradeRecord, GradeCategory } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { percentageToLetterGrade } from '../../lib/utils';

interface GradeBookProps {
  courseStudents: User[];
  courseId: string;
  courseGrades: GradeRecord[];
  onSaveGrade: (grade: Partial<GradeRecord>) => void;
  onDeleteGrade: (id: string) => void;
}

export const GradeBook: React.FC<GradeBookProps> = ({
  courseStudents,
  courseId,
  courseGrades,
  onSaveGrade,
  onDeleteGrade,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(courseStudents[0]?.id || '');
  const [title, setTitle] = useState('');
  const [score, setScore] = useState(85);
  const [maxScore, setMaxScore] = useState(100);
  const [category, setCategory] = useState<GradeCategory>('assignment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedStudentId) return;

    onSaveGrade({
      studentId: selectedStudentId,
      courseId,
      title,
      score: Number(score),
      maxScore: Number(maxScore),
      category,
      date: new Date().toISOString().split('T')[0],
    });

    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2 pb-3 border-b border-border">
          <Plus className="w-4 h-4 text-primary" />
          Log New Grade / Assessment Record
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2 text-xs font-bold text-foreground"
            >
              {courseStudents.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Term Exam"
              className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
            >
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="project">Project</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Score / Max</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl p-2 text-xs font-bold text-foreground"
              />
              <span className="text-muted-foreground">/</span>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl p-2 text-xs font-bold text-foreground"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Grade
            </button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-foreground text-sm">Course Gradebook History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-surface-2 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Assessment Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courseGrades.map((g) => {
                const st = courseStudents.find((s) => s.id === g.studentId);
                const pct = Math.round((g.score / g.maxScore) * 100);
                const letter = percentageToLetterGrade(pct);
                return (
                  <tr key={g.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-4 py-3 font-bold">{st?.name || g.studentId}</td>
                    <td className="px-4 py-3 text-foreground">{g.title}</td>
                    <td className="px-4 py-3 uppercase text-[10px] font-bold text-primary">{g.category}</td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">{g.score} / {g.maxScore} ({pct}%)</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">{letter}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDeleteGrade(g.id)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
