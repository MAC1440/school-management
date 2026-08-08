import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Calendar,
  Clock,
  Printer,
  FileText,
  FileQuestion,
} from 'lucide-react';
import { User, Course, GradeRecord, AttendanceRecord } from '../../types';
import { percentageToLetterGrade, percentageToGpa, calculateAttendancePercentage } from '../../lib/utils';
import { useGetAssessmentsQuery } from '../../store/apiSlice';
import { GradeSummary } from './GradeSummary';
import { AssessmentList } from './AssessmentList';

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
  const { data: upcomingAssessments = [] } = useGetAssessmentsQuery();

  const myGrades = (grades || []).filter((g) => g.studentId === studentUser?.id);
  const myAttendance = (attendance || []).filter((a) => a.studentId === studentUser?.id);

  const totalPercentage =
    myGrades.length > 0
      ? Math.round(myGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / myGrades.length)
      : 92;

  const cumulativeGpa = percentageToGpa(totalPercentage);
  const attendanceRate = calculateAttendancePercentage(myAttendance);

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
    <div className="space-y-6">
      {/* Student Profile & Banner */}
      <div className="bg-gradient-to-r from-sidebar via-primary to-surface-2 rounded-2xl p-6 text-primary-foreground shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={studentUser.avatar}
              alt={studentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-accent/30 border-2 border-primary-foreground/20"
            />
            <div>
              <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent border border-accent/30 px-3 py-0.5 rounded-full text-[11px] font-bold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-accent" />
                <span>Student Academic Portal</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{studentUser.name}</h1>
              <p className="text-primary-foreground/80 text-xs mt-0.5">
                {studentUser.gradeLevel || 'Grade 11'} | Campus: {studentUser.branchName || 'Main Campus'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintReportCard}
            className="bg-card text-foreground hover:bg-surface-2 font-bold px-3.5 py-2 rounded-xl text-xs transition-all border border-border flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-primary" />
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('grades')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'grades'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Grades & Course Report</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-primary" />
          <span>Upcoming Tests & Quizzes ({upcomingAssessments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'attendance'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Attendance Log</span>
        </button>
      </div>

      {activeTab === 'grades' && (
        <GradeSummary
          gradesByCourse={gradesByCourse}
          cumulativeGpa={cumulativeGpa}
          totalPercentage={totalPercentage}
          onPrintReportCard={handlePrintReportCard}
        />
      )}

      {activeTab === 'upcoming' && (
        <AssessmentList assessments={upcomingAssessments} />
      )}

      {activeTab === 'attendance' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground text-base">My Attendance History</h3>
              <p className="text-xs text-muted-foreground">Official check-in logs</p>
            </div>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/30">
              {attendanceRate}% Attendance Rate
            </span>
          </div>

          <div className="divide-y divide-border text-xs">
            {myAttendance.map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-bold text-foreground">{att.courseName}</p>
                    <p className="text-[11px] text-muted-foreground">{att.date}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    att.status === 'present'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                      : att.status === 'tardy'
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
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
