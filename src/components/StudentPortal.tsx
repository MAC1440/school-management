import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Printer,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';
import { User, Course, GradeRecord, AttendanceRecord, AssessmentItem } from '../types';
import { percentageToLetterGrade, percentageToGpa, calculateAttendancePercentage } from '../lib/utils';
import { fetchAssessments } from '../lib/api';

interface StudentPortalProps {
  studentUser: User;
  courses: Course[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  studentUser,
  courses = [],
  grades = [],
  attendance = [],
}) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'upcoming' | 'attendance'>('grades');
  const [upcomingAssessments, setUpcomingAssessments] = useState<AssessmentItem[]>([]);

  useEffect(() => {
    loadStudentData();
  }, [studentUser?.id]);

  const loadStudentData = async () => {
    try {
      const items = await fetchAssessments();
      setUpcomingAssessments(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setUpcomingAssessments([]);
    }
  };

  // Filter student-specific data
  const myGrades = (grades || []).filter((g) => g.studentId === studentUser?.id);
  const myAttendance = (attendance || []).filter((a) => a.studentId === studentUser?.id);

  // Cumulative calculations
  const totalPercentage =
    myGrades.length > 0
      ? Math.round(myGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / myGrades.length)
      : 92;

  const cumulativeGpa = percentageToGpa(totalPercentage);
  const attendanceRate = calculateAttendancePercentage(myAttendance);

  // Group grades by course
  const gradesByCourse = (courses || []).map((course) => {
    const courseGrades = myGrades.filter((g) => g.courseId === course.id);
    const avg =
      courseGrades.length > 0
        ? Math.round(courseGrades.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / courseGrades.length)
        : 88;
    return {
      course,
      grades: courseGrades,
      averagePct: avg,
      letterGrade: percentageToLetterGrade(avg),
    };
  });

  const handlePrintReportCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Student Profile & Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={studentUser.avatar}
              alt={studentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-400/30 border-2 border-white/20"
            />
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-0.5 rounded-full text-[11px] font-bold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
                <span>Student Academic Portal</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{studentUser.name}</h1>
              <p className="text-emerald-100/80 text-xs mt-0.5">
                {studentUser.gradeLevel || 'Grade 11'} | Campus: {studentUser.branchName || 'Main Campus'} | ID: STU-2025-0101
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintReportCard}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all border border-emerald-300/30 flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      {/* Student Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative GPA</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{cumulativeGpa.toFixed(2)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Scale of 4.00</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Award className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Average</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {totalPercentage}% ({percentageToLetterGrade(totalPercentage)})
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Honor Roll Standing</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <FileText className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Rate</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{attendanceRate}%</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Satisfactory</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Calendar className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('grades')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'grades'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Grades & Course Report</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'upcoming'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-purple-600" />
          <span>Upcoming Tests, Quizzes & Papers ({upcomingAssessments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'attendance'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Attendance Log</span>
        </button>
      </div>

      {/* TAB 1: GRADES */}
      {activeTab === 'grades' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradesByCourse.map(({ course, grades: cGrades, averagePct, letterGrade }) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{course.name}</h3>
                  <p className="text-xs text-slate-500">{course.teacherName} • {course.room}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{letterGrade}</span>
                  <p className="text-xs font-bold text-emerald-600">{averagePct}%</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Graded Assessments ({cGrades.length})
                </p>

                {cGrades.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No recorded grades yet for this term.</p>
                ) : (
                  cGrades.map((g) => (
                    <div key={g.id} className="flex items-center justify-between text-xs py-1">
                      <div>
                        <p className="font-semibold text-slate-800">{g.title}</p>
                        <p className="text-[10px] text-slate-400">{g.category} • {g.date}</p>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-900">
                        {g.score} / {g.maxScore}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: UPCOMING TESTS, QUIZZES & PAPERS */}
      {activeTab === 'upcoming' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Upcoming Tests, Quizzes & Research Papers</h3>
            <p className="text-xs text-slate-500">Scheduled examinations and project deadlines for your courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(upcomingAssessments || []).map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold uppercase">
                    {item.courseName}
                  </span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    Due: {item.dueDate}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600">{item.description}</p>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Weightage: <strong>{item.weightage}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE HISTORY */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">My Attendance History</h3>
              <p className="text-xs text-slate-500">Official check-in logs</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              {attendanceRate}% Attendance Rate
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myAttendance.map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-900">{att.courseName}</p>
                    <p className="text-[11px] text-slate-500">{att.date}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    att.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : att.status === 'tardy'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {att.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
