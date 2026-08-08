import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  Sparkles,
  Megaphone,
  BarChart2,
  CheckCircle2,
  RefreshCw,
  Plus,
  Send,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SchoolStats, Announcement, User, GradeRecord, AttendanceRecord } from '../types';
import { generateAIExecutiveSummary, saveAnnouncement } from '../lib/api';

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
  const safeUsers = Array.isArray(users) ? users : [];
  const safeGrades = Array.isArray(grades) ? grades : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState<string>('');

  // Announcement Modal
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'urgent' | 'normal' | 'info'>('normal');

  useEffect(() => {
    // Initial load AI summary
    handleGenerateAiSummary();
  }, []);

  const handleGenerateAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const res = await generateAIExecutiveSummary();
      setAiSummary(res.summary);
      setAiSource(res.source);
    } catch (err) {
      setAiSummary('Failed to connect to AI server. Please retry.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    await saveAnnouncement({
      title: annTitle,
      content: annContent,
      authorName: 'Dr. Arthur Vance',
      authorRole: 'principal',
      priority: annPriority,
      targetAudience: 'all',
      date: new Date().toISOString().split('T')[0],
    });

    setAnnTitle('');
    setAnnContent('');
    setIsAnnouncementModalOpen(false);
    onRefreshData();
  };

  // Recharts Chart Data Calculations
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

  // At-risk students identification
  const studentsList = safeUsers.filter((u) => u.role === 'student');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Principal Executive Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Principal Office Executive Suite</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">School Executive Intelligence & KPIs</h1>
            <p className="text-amber-100/80 text-sm mt-1 max-w-xl">
              Real-time oversight of overall academic performance, schoolwide attendance metrics, faculty evaluations, and AI executive summaries.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center space-x-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
            <button
              onClick={handleGenerateAiSummary}
              disabled={isAiLoading}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-amber-300/30 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAiLoading ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats ? `${stats.overallAttendanceRate}%` : '94%'}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>+1.8% above semester target</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">School GPA Average</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats ? stats.averageGpa.toFixed(2) : '3.62'}
          </p>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Grade 11 & 12 weighted average</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats ? stats.totalStudents : studentsList.length}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Students across Grade 10-12</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">At-Risk Alerts</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">
            {stats ? stats.atRiskStudentsCount : 2}
          </p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Requires counselor intervention</p>
        </div>
      </div>

      {/* AI Executive Summary Box (Gemini AI) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-500/20">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-indigo-500/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-wide text-indigo-100">
              AI Principal Executive Intelligence
            </h3>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-mono uppercase">
            Powered by Gemini
          </span>
        </div>

        {isAiLoading ? (
          <div className="py-8 text-center text-indigo-200 flex flex-col items-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-xs font-medium">Generating executive report from school metrics...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-xs max-w-none text-xs text-indigo-100/90 whitespace-pre-line leading-relaxed">
            {aiSummary}
          </div>
        )}
      </div>

      {/* Department Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Department Academic GPA Metrics</h3>
              <p className="text-xs text-slate-500">Average GPA & Attendance Rate by Academic Faculty</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <span className="inline-block w-3 h-3 bg-indigo-600 rounded-sm" />
              <span>Avg GPA (Out of 4.0)</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 4.0]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="gpa" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Distribution Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">School Attendance Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of student daily statuses</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendanceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
            {attendanceDistributionData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>
                  {item.name}: <strong className="text-slate-900">{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Intervention Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">At-Risk Student Early Intervention List</h3>
            <p className="text-xs text-slate-500">Students flagged for academic support or attendance counseling</p>
          </div>
          <span className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            Auto-Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">Ethan Thorne</span>
                <span className="text-[10px] bg-white text-amber-800 font-extrabold px-2 py-0.5 rounded-md border border-amber-200">
                  Grade 11
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Midterm score in AP Physics C: <strong className="text-amber-800">72%</strong> | Attendance:{' '}
                <strong className="text-amber-800">80%</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-2 italic">
                Note: "Requires assistance with rotational dynamics homework and morning punctuality."
              </p>
            </div>
            <button className="text-xs font-bold text-amber-800 bg-white border border-amber-300 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-colors shrink-0">
              Notify Counselor
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">Liam Nguyen</span>
                <span className="text-[10px] bg-white text-blue-800 font-extrabold px-2 py-0.5 rounded-md border border-blue-200">
                  Grade 11
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Recent Absences: <strong className="text-blue-800">Excused Medical</strong> | GPA:{' '}
                <strong className="text-blue-800">3.40</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-2 italic">
                Note: "Parent note submitted for medical appointment on 2026-08-07."
              </p>
            </div>
            <button className="text-xs font-bold text-blue-800 bg-white border border-blue-300 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors shrink-0">
              View File
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <span>Broadcast Principal Announcement</span>
              </h3>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePublishAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Examination Schedule & Room Assignments"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-amber-500"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="urgent">Urgent School Alert</option>
                  <option value="info">General Information</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed message for faculty and students..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Shared Feed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
