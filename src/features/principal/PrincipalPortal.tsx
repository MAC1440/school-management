import React, { useState } from 'react';
import { Award, Megaphone, Plus, X, Send } from 'lucide-react';
import { SchoolStats, Announcement, User, GradeRecord, AttendanceRecord } from '../../types';
import { useSaveAnnouncementMutation } from '../../store/apiSlice';
import { KpiCards } from './KpiCards';
import { DepartmentChart } from './DepartmentChart';
import { AttendancePieChart } from './AttendancePieChart';

interface PrincipalPortalProps {
  stats: SchoolStats | null;
  announcements: Announcement[];
  users: User[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  onRefreshData: () => void;
}

export const PrincipalPortal: React.FC<PrincipalPortalProps> = ({
  stats,
  announcements = [],
  users = [],
  grades = [],
  attendance = [],
  onRefreshData,
}) => {
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];

  const [saveAnnApi] = useSaveAnnouncementMutation();

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'urgent' | 'normal' | 'info'>('normal');

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    await saveAnnApi({
      title: annTitle,
      content: annContent,
      authorName: 'Dr. Arthur Vance',
      authorRole: 'principal',
      priority: annPriority,
      targetAudience: 'all',
      date: new Date().toISOString().split('T')[0],
    }).unwrap();

    setAnnTitle('');
    setAnnContent('');
    setIsAnnouncementModalOpen(false);
    onRefreshData();
  };

  const departmentChartData = [
    { name: 'Science & Math', gpa: 3.72, attendance: 96 },
    { name: 'Humanities', gpa: 3.48, attendance: 93 },
    { name: 'Computer Science', gpa: 3.85, attendance: 97 },
    { name: 'Natural Sciences', gpa: 3.52, attendance: 94 },
  ];

  const attendanceDistributionData = [
    { name: 'Present', value: safeAttendance.filter((a) => a.status === 'present').length || 18, color: '#10B981' },
    { name: 'Tardy', value: safeAttendance.filter((a) => a.status === 'tardy').length || 3, color: '#F59E0B' },
    { name: 'Absent', value: safeAttendance.filter((a) => a.status === 'absent').length || 2, color: '#EF4444' },
    { name: 'Excused', value: safeAttendance.filter((a) => a.status === 'excused').length || 1, color: '#3B82F6' },
  ];

  return (
    <div className="space-y-6">
      {/* Principal Executive Banner */}
      <div className="bg-gradient-to-r from-sidebar via-primary to-surface-2 rounded-3xl p-6 text-primary-foreground shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Award className="w-4 h-4 text-accent" />
              <span>Institutional Oversight & Leadership</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Principal Executive Dashboard</h1>
            <p className="text-primary-foreground/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Monitor academic GPA benchmarks, attendance health across campuses, department standards, and issue institutional announcements.
            </p>
          </div>

          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <Megaphone className="w-4 h-4" />
            <span>Publish Campus Announcement</span>
          </button>
        </div>
      </div>

      <KpiCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentChart data={departmentChartData} />
        </div>
        <div>
          <AttendancePieChart data={attendanceDistributionData} />
        </div>
      </div>

      {/* Recent Campus Bulletins */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-border">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-primary" />
            Active Campus Announcements ({safeAnnouncements.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeAnnouncements.map((ann) => (
            <div key={ann.id} className="p-4 bg-surface border border-border rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  ann.priority === 'urgent'
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                    : 'bg-primary/10 text-primary border border-primary/30'
                }`}>
                  {ann.priority}
                </span>
                <span className="text-[10px] text-muted-foreground">{ann.date}</span>
              </div>
              <h4 className="font-bold text-foreground text-sm">{ann.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{ann.content}</p>
              <p className="text-[10px] text-primary font-medium pt-1">Author: {ann.authorName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-base">New Campus Announcement</h3>
              <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground"
                  placeholder="e.g. Mid-Term Examination Schedule"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Priority</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="info">Informational</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Announcement Message</label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground"
                  placeholder="Write message content here..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
