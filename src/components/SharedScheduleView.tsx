import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Filter, BookOpen, Search } from 'lucide-react';
import { ScheduleItem, DaysOfWeek, Course } from '../types';
import { getCourseColorClass } from '../lib/utils';

interface SharedScheduleViewProps {
  schedule: ScheduleItem[];
  courses: Course[];
}

export const SharedScheduleView: React.FC<SharedScheduleViewProps> = ({ schedule = [], courses = [] }) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  const days: DaysOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6];

  const safeSchedule = Array.isArray(schedule) ? schedule : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  const filteredSchedule = safeSchedule.filter((s) => {
    const matchDay = selectedDay === 'all' || s.day === selectedDay;
    const matchCourse = selectedCourseFilter === 'all' || s.courseId === selectedCourseFilter;
    return matchDay && matchCourse;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Master Timetable & Course Schedules</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Class Schedule</h1>
          <p className="text-indigo-200/80 text-sm mt-1">
            Weekly timetable matrix across periods 1 through 6, room assignments, and subject slots.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day Filter */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Days (Mon - Fri)</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Courses</option>
            {safeCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-6 gap-3 mb-3 text-center border-b border-slate-200 pb-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Period / Time</div>
            {days.map((d) => (
              <div
                key={d}
                className={`text-xs font-extrabold uppercase tracking-wider py-1 rounded-lg ${
                  selectedDay === d ? 'bg-indigo-600 text-white' : 'text-slate-700 bg-slate-100'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {periods.map((periodNum) => {
              const timeSlot =
                periodNum === 1
                  ? '08:30 - 09:45 AM'
                  : periodNum === 2
                  ? '09:55 - 11:10 AM'
                  : periodNum === 3
                  ? '11:20 - 12:35 PM'
                  : periodNum === 4
                  ? '01:25 - 02:40 PM'
                  : periodNum === 5
                  ? '02:50 - 04:05 PM'
                  : '04:15 - 05:30 PM';

              return (
                <div key={periodNum} className="grid grid-cols-6 gap-3 items-stretch min-h-24">
                  {/* Period Time Header Column */}
                  <div className="flex flex-col justify-center items-center bg-slate-50 border border-slate-200 rounded-xl p-2 text-center">
                    <span className="font-extrabold text-slate-900 text-sm">Period {periodNum}</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">{timeSlot}</span>
                  </div>

                  {/* Days Columns for this period */}
                  {days.map((dayName) => {
                    const matchedItem = filteredSchedule.find(
                      (s) => s.day === dayName && s.period === periodNum
                    );

                    if (!matchedItem) {
                      return (
                        <div
                          key={dayName}
                          className="border border-dashed border-slate-200 rounded-xl p-2 bg-slate-50/30 flex items-center justify-center text-[11px] text-slate-300 font-medium"
                        >
                          Study Block
                        </div>
                      );
                    }

                    const colors = getCourseColorClass(matchedItem.color);

                    return (
                      <div
                        key={dayName}
                        className={`p-3 rounded-xl border ${colors.bg} ${colors.border} flex flex-col justify-between shadow-2xs hover:scale-[1.02] transition-transform`}
                      >
                        <div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/80 text-slate-800">
                            {matchedItem.courseCode}
                          </span>
                          <h4 className="font-bold text-xs mt-1 text-slate-900 leading-snug">
                            {matchedItem.courseName}
                          </h4>
                        </div>

                        <div className="mt-2 text-[10px] text-slate-600 space-y-0.5 border-t border-slate-200/50 pt-1.5">
                          <p className="flex items-center space-x-1 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{matchedItem.room}</span>
                          </p>
                          <p className="text-slate-500 italic truncate">{matchedItem.teacherName}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
