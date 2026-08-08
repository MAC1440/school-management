import React from 'react';
import { User, AttendanceStatus } from '../../types';
import { Save, Check } from 'lucide-react';

interface AttendanceLoggerProps {
  courseStudents: User[];
  attendanceDate: string;
  setAttendanceDate: (d: string) => void;
  attendanceDraft: Record<string, AttendanceStatus>;
  setAttendanceDraft: React.Dispatch<React.SetStateAction<Record<string, AttendanceStatus>>>;
  onSubmitAttendance: () => void;
  isSubmitting: boolean;
  successMsg: string | null;
}

export const AttendanceLogger: React.FC<AttendanceLoggerProps> = ({
  courseStudents,
  attendanceDate,
  setAttendanceDate,
  attendanceDraft,
  setAttendanceDraft,
  onSubmitAttendance,
  isSubmitting,
  successMsg,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-foreground text-sm">Classroom Daily Student Attendance</h3>
          <p className="text-xs text-muted-foreground">Mark daily status for enrolled students.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-foreground font-bold focus:outline-none"
          />
          <button
            onClick={onSubmitAttendance}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Attendance'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="bg-surface-2 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Grade Level</th>
              <th className="px-4 py-3 text-center">Attendance Status Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courseStudents.map((st) => {
              const currentStatus = attendanceDraft[st.id] || 'present';
              return (
                <tr key={st.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-4 py-3 font-bold flex items-center gap-2">
                    <img src={st.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-border" />
                    <span>{st.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{st.gradeLevel || 'Grade 11'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {(['present', 'tardy', 'absent', 'excused'] as AttendanceStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setAttendanceDraft((prev) => ({ ...prev, [st.id]: status }))}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            currentStatus === status
                              ? status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : status === 'tardy'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-blue-600 text-white shadow-xs'
                              : 'bg-surface-2 text-muted-foreground hover:bg-surface-2/80'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
