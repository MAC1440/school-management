import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Sparkles,
  Award,
  Users,
  Send,
  FileText,
  Save,
  Check,
  AlertCircle,
  DollarSign,
  Briefcase,
  Layers,
  CheckSquare,
  Building2,
  UserCheck,
} from 'lucide-react';
import {
  User,
  Course,
  AttendanceRecord,
  GradeRecord,
  AttendanceStatus,
  GradeCategory,
  TopicPlan,
  LeaveApplication,
} from '../types';
import {
  submitBatchAttendance,
  saveGrade,
  fetchTopicPlans,
  toggleTopicCompletion,
  submitLeaveApplication,
  fetchStaffAttendance,
  fetchCalendarConfig,
} from '../lib/api';
import { percentageToLetterGrade } from '../lib/utils';

interface TeacherPortalProps {
  teacherUser: User;
  courses: Course[];
  students: User[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  onRefreshData: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teacherUser,
  courses = [],
  students = [],
  attendance = [],
  grades = [],
  onRefreshData,
}) => {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeStudents = Array.isArray(students) ? students : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const safeGrades = Array.isArray(grades) ? grades : [];

  const teacherCourses = safeCourses.filter((c) => c.teacherId === teacherUser?.id || teacherUser?.role === 'admin');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(teacherCourses[0]?.id || 'course-1');
  const activeCourse = safeCourses.find((c) => c.id === selectedCourseId) || teacherCourses[0];

  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'topics' | 'attendance' | 'gradebook' | 'leaves'
  >('profile');

  // --- TOPIC TRACKER STATE ---
  const [topicPlans, setTopicPlans] = useState<TopicPlan[]>([]);

  // --- LEAVE FORM STATE ---
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'casual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // --- ATTENDANCE STATE ---
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const courseStudents = safeStudents.filter((s) => s.role === 'student');

  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceNotes, setAttendanceNotes] = useState<Record<string, string>>({});
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceSuccessMsg, setAttendanceSuccessMsg] = useState<string | null>(null);

  // --- PAY & ATTENDANCE SUMMARY ---
  const [staffLogs, setStaffLogs] = useState<any[]>([]);
  const [calConfig, setCalConfig] = useState({ totalWorkingDaysPerMonth: 22, perDayPenaltyRate: 150 });

  useEffect(() => {
    loadTeacherData();
  }, [selectedCourseId, teacherUser?.id]);

  const loadTeacherData = async () => {
    try {
      const tp = await fetchTopicPlans(selectedCourseId);
      setTopicPlans(Array.isArray(tp) ? tp : []);

      const sa = await fetchStaffAttendance();
      const myLogs = (Array.isArray(sa) ? sa : []).filter((l: any) => l.staffId === teacherUser?.id);
      setStaffLogs(myLogs);

      const cfg = await fetchCalendarConfig();
      if (cfg) setCalConfig(cfg);
    } catch (err) {
      console.error('Error loading teacher portal data:', err);
    }
  };

  useEffect(() => {
    const existing = safeAttendance.filter((a) => a.courseId === selectedCourseId && a.date === attendanceDate);
    const draft: Record<string, AttendanceStatus> = {};
    const notes: Record<string, string> = {};

    courseStudents.forEach((st) => {
      const match = existing.find((a) => a.studentId === st.id);
      draft[st.id] = match ? match.status : 'present';
      if (match?.notes) notes[st.id] = match.notes;
    });

    setAttendanceDraft(draft);
    setAttendanceNotes(notes);
  }, [selectedCourseId, attendanceDate, attendance]);

  const handleToggleTopic = async (topicId: string) => {
    try {
      const updated = await toggleTopicCompletion(selectedCourseId, topicId);
      setTopicPlans(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason) return;
    try {
      await submitLeaveApplication({
        applicantId: teacherUser.id,
        applicantName: teacherUser.name,
        role: teacherUser.role,
        leaveType: leaveForm.leaveType as any,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason,
      });
      setLeaveSubmitted(true);
      setLeaveForm({
        leaveType: 'casual',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: '',
      });
    } catch (err) {
      alert('Failed to submit leave application');
    }
  };

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const draft: Record<string, AttendanceStatus> = {};
    courseStudents.forEach((st) => {
      draft[st.id] = 'present';
    });
    setAttendanceDraft(draft);
  };

  const handleSubmitAttendance = async () => {
    setIsSubmittingAttendance(true);
    setAttendanceSuccessMsg(null);
    try {
      const recordsToSubmit: AttendanceRecord[] = courseStudents.map((st) => ({
        id: `att-${selectedCourseId}-${st.id}-${attendanceDate}`,
        studentId: st.id,
        studentName: st.name,
        courseId: selectedCourseId,
        courseName: activeCourse ? activeCourse.name : 'Course',
        date: attendanceDate,
        status: attendanceDraft[st.id] || 'present',
        notes: attendanceNotes[st.id] || '',
      }));

      await submitBatchAttendance(recordsToSubmit);
      setAttendanceSuccessMsg(`Attendance recorded for ${courseStudents.length} students on ${attendanceDate}!`);
      onRefreshData();
    } catch (err) {
      alert('Failed to submit attendance.');
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  // Gradebook
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState<{
    studentId: string;
    title: string;
    category: GradeCategory;
    score: number;
    maxScore: number;
    feedback: string;
  }>({
    studentId: courseStudents[0]?.id || 'student-1',
    title: '',
    category: 'Homework',
    score: 90,
    maxScore: 100,
    feedback: '',
  });

  const handleSaveGradeRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.title) return;

    const studentObj = students.find((s) => s.id === newGrade.studentId);
    await saveGrade({
      studentId: newGrade.studentId,
      studentName: studentObj ? studentObj.name : 'Student',
      courseId: selectedCourseId,
      courseName: activeCourse ? activeCourse.name : 'Course',
      title: newGrade.title,
      category: newGrade.category,
      score: Number(newGrade.score),
      maxScore: Number(newGrade.maxScore),
      date: new Date().toISOString().split('T')[0],
      feedback: newGrade.feedback,
    });

    setIsGradeModalOpen(false);
    onRefreshData();
  };

  const currentCourseGrades = safeGrades.filter((g) => g.courseId === selectedCourseId);

  // Pay cut calculation
  const safeStaffLogs = Array.isArray(staffLogs) ? staffLogs : [];
  const presentCount = safeStaffLogs.filter((l) => l.status === 'present' || l.status === 'tardy').length || 21;
  const unexcusedAbsence = safeStaffLogs.filter((l) => l.status === 'absent').length || 1;
  const baseSalary = teacherUser?.baseSalary || 4800;
  const payCutDeduction = unexcusedAbsence * (calConfig?.perDayPenaltyRate || 150);
  const netMonthlySalary = Math.max(0, baseSalary - payCutDeduction);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Teacher Faculty Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Instructor Workstation & Lecture Planner</h1>
            <p className="text-blue-100/80 text-xs sm:text-sm mt-1 max-w-xl">
              Welcome back, {teacherUser.name}. Track daily planned vs actual topics, log attendance, review pay cut stats, and manage classroom grades.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 min-w-64">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
              Active Course Context
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-900 text-white font-bold text-xs p-2.5 rounded-lg border border-blue-400/40 focus:outline-none"
            >
              {teacherCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name} ({c.room})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 text-xs font-bold pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Faculty Profile & Pay Status</span>
        </button>

        <button
          onClick={() => setActiveSubTab('topics')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'topics' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>Lecture Topic Tracker ({topicPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'attendance' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Class Attendance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gradebook')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'gradebook' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Gradebook & Scores</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaves')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'leaves' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* --- SUB-TAB 1: FACULTY PROFILE & PAY CUT STATUS --- */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Teacher Details Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img src={teacherUser.avatar} alt={teacherUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{teacherUser.name}</h3>
                  <p className="text-xs text-slate-500">{teacherUser.department || 'Science & Math'}</p>
                  <p className="text-[10px] font-mono text-purple-600 font-bold mt-0.5">Kiosk PIN: {teacherUser.pin || '1234'}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <p>Campus Branch: <strong>{teacherUser.branchName || 'Main Campus'}</strong></p>
                <p>Email: <strong>{teacherUser.email}</strong></p>
                <p>Teaching Courses: <strong>{teacherCourses.length} Assigned</strong></p>
              </div>
            </div>

            {/* Attendance & Working Days */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Metric</span>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {presentCount} / {calConfig.totalWorkingDaysPerMonth} <span className="text-xs font-normal text-slate-500">days present</span>
              </div>
              <p className="text-xs text-slate-500">Unexcused Absences: <strong className="text-rose-600">{unexcusedAbsence} days</strong></p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (presentCount / calConfig.totalWorkingDaysPerMonth) * 100)}%` }}
                />
              </div>
            </div>

            {/* Salary & Pay-Cut Calculation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Pay Calculation</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                ${netMonthlySalary.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 font-mono">
                <div>Base Salary: ${baseSalary.toLocaleString()}</div>
                <div className="text-rose-600">Attendance Penalty Cut: -${payCutDeduction}</div>
              </div>
            </div>

          </div>

          {/* Assigned Classes List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-3">Assigned Classes & Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherCourses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">{c.code}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{c.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Room: <strong>{c.room}</strong> | Grade: {c.gradeLevel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: DAILY PLANNED VS ACTUAL TOPICS --- */}
      {activeSubTab === 'topics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Lecture Topic Completion Tracker</h3>
              <p className="text-xs text-slate-500">
                Compare planned topics against actual topics covered in class for <strong>{activeCourse?.name}</strong>.
              </p>
            </div>
            <div className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg">
              Covered: {topicPlans.filter((t) => t.isCompleted).length} / {topicPlans.length} Topics
            </div>
          </div>

          <div className="space-y-3">
            {topicPlans.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleToggleTopic(topic.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  topic.isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      topic.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {topic.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div>
                    <h4 className={`font-bold text-sm ${topic.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {topic.topicTitle}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Planned Date: {topic.plannedDate} • Duration: {topic.durationMinutes} mins
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    topic.isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {topic.isCompleted ? 'Covered' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: ATTENDANCE LOGGER --- */}
      {activeSubTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Attendance Logger — {activeCourse ? activeCourse.name : 'Course'}
              </h3>
              <p className="text-xs text-slate-500">
                Mark daily attendance status for enrolled students ({courseStudents.length} students)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800 text-xs"
              />

              <button
                onClick={handleMarkAllPresent}
                className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Mark All Present
              </button>

              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmittingAttendance}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmittingAttendance ? 'Saving...' : 'Save Attendance'}</span>
              </button>
            </div>
          </div>

          {attendanceSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{attendanceSuccessMsg}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Status Selection</th>
                  <th className="py-3 px-4">Note / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {courseStudents.map((student) => {
                  const currentStatus = attendanceDraft[student.id] || 'present';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-[10px] text-slate-400">STU-100</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          {['present', 'tardy', 'absent', 'excused'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleSetStatus(student.id, st as any)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                                currentStatus === st
                                  ? st === 'present'
                                    ? 'bg-emerald-500 text-white'
                                    : st === 'tardy'
                                    ? 'bg-amber-500 text-white'
                                    : st === 'absent'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-blue-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Optional note..."
                          value={attendanceNotes[student.id] || ''}
                          onChange={(e) =>
                            setAttendanceNotes({ ...attendanceNotes, [student.id]: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 4: GRADEBOOK --- */}
      {activeSubTab === 'gradebook' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Gradebook & Assignments — {activeCourse ? activeCourse.name : 'Course'}
              </h3>
              <p className="text-xs text-slate-500">Record assessment scores and feedback</p>
            </div>

            <button
              onClick={() => setIsGradeModalOpen(true)}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-md transition-colors flex items-center space-x-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Score</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Assessment Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {currentCourseGrades.map((g) => {
                  const pct = Math.round((g.score / g.maxScore) * 100);
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{g.studentName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{g.title}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          {g.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">{g.score} / {g.maxScore}</td>
                      <td className="py-3 px-4">
                        <span className={`font-extrabold px-2 py-0.5 rounded-md ${pct >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                          {pct}% ({percentageToLetterGrade(pct)})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 italic">{g.feedback || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 5: APPLY LEAVE FORM --- */}
      {activeSubTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-lg">
          <h3 className="font-bold text-slate-900 text-lg mb-1">Submit Leave Application</h3>
          <p className="text-xs text-slate-500 mb-6">Request time-off for approval by administration.</p>

          {leaveSubmitted && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              Leave application submitted successfully! Pending admin approval.
            </div>
          )}

          <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
              <select
                value={leaveForm.leaveType}
                onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="maternity">Maternity / Paternity</option>
                <option value="unpaid">Unpaid Personal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason / Context *</label>
              <textarea
                rows={3}
                required
                placeholder="State your reason..."
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
            >
              Submit Leave Request
            </button>
          </form>
        </div>
      )}

      {/* Grade Modal */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Grade Score</h3>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <form onSubmit={handleSaveGradeRecord} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select
                  value={newGrade.studentId}
                  onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                >
                  {courseStudents.map((st) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Exam title"
                  value={newGrade.title}
                  onChange={(e) => setNewGrade({ ...newGrade, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Score</label>
                  <input
                    type="number"
                    value={newGrade.score}
                    onChange={(e) => setNewGrade({ ...newGrade, score: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={newGrade.maxScore}
                    onChange={(e) => setNewGrade({ ...newGrade, maxScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsGradeModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-600 rounded-xl">Save Score</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
