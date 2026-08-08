import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Briefcase,
  Layers,
} from 'lucide-react';
import {
  User,
  Course,
  AttendanceRecord,
  GradeRecord,
  AttendanceStatus,
  TopicPlan,
} from '../../types';
import {
  useGetStaffAttendanceQuery,
  useGetCalendarConfigQuery,
  useGetGradesQuery,
  useSubmitBatchAttendanceMutation,
  useSaveGradeMutation,
  useDeleteGradeMutation,
  useSubmitLeaveMutation,
  useGetTeacherTopicsQuery,
  useUpdateTopicStatusMutation,
} from '../../store/apiSlice';
import { TeacherProfile } from './TeacherProfile';
import { TopicTracker } from './TopicTracker';
import { AttendanceLogger } from './AttendanceLogger';
import { GradeBook } from './GradeBook';
import { LeaveManager } from './LeaveManager';

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

  const teacherCourses = safeCourses.filter((c) => c.teacherId === teacherUser?.id || teacherUser?.role === 'admin');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(teacherCourses[0]?.id || 'course-1');
  const activeCourse = safeCourses.find((c) => c.id === selectedCourseId) || teacherCourses[0];

  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'topics' | 'attendance' | 'gradebook' | 'leaves'
  >('profile');

  // RTK Query hooks
  const { data: staffLogs = [] } = useGetStaffAttendanceQuery({ staffId: teacherUser?.id });
  const { data: calConfigData } = useGetCalendarConfigQuery();
  const { data: rawTopics = [] } = useGetTeacherTopicsQuery({ courseId: selectedCourseId });
  const { data: courseGrades = [] } = useGetGradesQuery({ courseId: selectedCourseId });

  const [submitBatchAttApi] = useSubmitBatchAttendanceMutation();
  const [saveGradeApi] = useSaveGradeMutation();
  const [deleteGradeApi] = useDeleteGradeMutation();
  const [submitLeaveApi] = useSubmitLeaveMutation();
  const [updateTopicApi] = useUpdateTopicStatusMutation();

  const totalWorkingDays = calConfigData?.totalWorkingDaysPerMonth || 22;
  const perDayPenaltyRate = calConfigData?.perDayPenaltyRate || 150;
  const totalAttended = staffLogs.filter((s) => s.status === 'present' || (s.status as string) === 'check_in').length || 18;
  const missingDays = Math.max(0, totalWorkingDays - totalAttended);
  const deductions = missingDays * perDayPenaltyRate;
  const netSalary = Math.max(0, (teacherUser?.baseSalary || 4500) - deductions);

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const courseStudents = safeStudents.filter((s) => s.role === 'student');
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceSuccessMsg, setAttendanceSuccessMsg] = useState<string | null>(null);
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const topicPlans: TopicPlan[] = rawTopics.map((t) => ({
    id: t.id,
    topicTitle: t.topicTitle,
    plannedDate: t.plannedDate,
    isCompleted: t.status === 'covered',
    durationMinutes: t.durationMinutes || 60,
  }));

  const handleToggleTopic = async (topicId: string) => {
    const topic = rawTopics.find((t) => t.id === topicId);
    const newStatus = topic?.status === 'covered' ? 'planned' : 'covered';
    await updateTopicApi({ id: topicId, status: newStatus }).unwrap();
  };

  const handleSubmitAttendance = async () => {
    setIsSubmittingAttendance(true);
    try {
      const selectedCourse = safeCourses.find((c) => c.id === selectedCourseId);
      const recordsToSubmit: AttendanceRecord[] = courseStudents.map((st) => ({
        id: `att-${Date.now()}-${st.id}`,
        studentId: st.id,
        studentName: st.name,
        courseId: selectedCourseId,
        courseName: selectedCourse?.name || 'Course',
        date: attendanceDate,
        status: attendanceDraft[st.id] || 'present',
      }));

      await submitBatchAttApi(recordsToSubmit).unwrap();
      setAttendanceSuccessMsg(`Attendance records submitted for ${attendanceDate}.`);
      onRefreshData();
    } catch (err) {
      setAttendanceSuccessMsg('Failed to submit attendance.');
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  const handleSaveGrade = async (grade: Partial<GradeRecord>) => {
    await saveGradeApi(grade).unwrap();
    onRefreshData();
  };

  const handleDeleteGrade = async (id: string) => {
    await deleteGradeApi(id).unwrap();
    onRefreshData();
  };

  const handleSubmitLeave = async (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => {
    await submitLeaveApi({
      applicantId: teacherUser.id,
      applicantName: teacherUser.name,
      leaveType: data.leaveType as any,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'pending',
    }).unwrap();
    setLeaveSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Header Banner */}
      <div className="bg-gradient-to-r from-sidebar via-primary to-surface-2 rounded-2xl p-6 text-primary-foreground shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Academic Faculty Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Faculty Management Operations</h1>
            <p className="text-primary-foreground/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Welcome back, {teacherUser.name}. Track daily planned vs actual topics, log attendance, review pay cut stats, and manage classroom grades.
            </p>
          </div>

          <div className="bg-surface/20 border border-border p-3 rounded-xl flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Active Class:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-card text-foreground font-bold text-xs rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {teacherCourses.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-border overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'profile' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface text-foreground border border-border hover:bg-surface-2'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Faculty Profile & Salary</span>
        </button>

        <button
          onClick={() => setActiveSubTab('topics')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'topics' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface text-foreground border border-border hover:bg-surface-2'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Planned vs Actual Topics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'attendance' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface text-foreground border border-border hover:bg-surface-2'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mark Class Attendance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gradebook')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'gradebook' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface text-foreground border border-border hover:bg-surface-2'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Gradebook & Marks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaves')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'leaves' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface text-foreground border border-border hover:bg-surface-2'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Apply Leave</span>
        </button>
      </div>

      {activeSubTab === 'profile' && (
        <TeacherProfile
          teacherUser={teacherUser}
          courses={teacherCourses}
          totalAttended={totalAttended}
          totalWorkingDays={totalWorkingDays}
          netSalary={netSalary}
          deductions={deductions}
        />
      )}

      {activeSubTab === 'topics' && (
        <TopicTracker
          courseName={activeCourse?.name}
          topicPlans={topicPlans}
          onToggleTopic={handleToggleTopic}
        />
      )}

      {activeSubTab === 'attendance' && (
        <AttendanceLogger
          courseStudents={courseStudents}
          attendanceDate={attendanceDate}
          setAttendanceDate={setAttendanceDate}
          attendanceDraft={attendanceDraft}
          setAttendanceDraft={setAttendanceDraft}
          onSubmitAttendance={handleSubmitAttendance}
          isSubmitting={isSubmittingAttendance}
          successMsg={attendanceSuccessMsg}
        />
      )}

      {activeSubTab === 'gradebook' && (
        <GradeBook
          courseStudents={courseStudents}
          courseId={selectedCourseId}
          courseGrades={courseGrades}
          onSaveGrade={handleSaveGrade}
          onDeleteGrade={handleDeleteGrade}
        />
      )}

      {activeSubTab === 'leaves' && (
        <LeaveManager
          onSubmitLeave={handleSubmitLeave}
          leaveSubmitted={leaveSubmitted}
        />
      )}
    </div>
  );
};
