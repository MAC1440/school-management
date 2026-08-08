import React, { useState } from 'react';
import { Megaphone, AlertCircle, Info, Bell, Tag, Calendar, User } from 'lucide-react';
import { Announcement } from '../types';

interface SharedAnnouncementsProps {
  announcements: Announcement[];
}

export const SharedAnnouncements: React.FC<SharedAnnouncementsProps> = ({ announcements = [] }) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

  const filtered = safeAnnouncements.filter((a) => {
    return priorityFilter === 'all' || a.priority === priorityFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-stone-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-200 border border-rose-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Megaphone className="w-4 h-4 text-rose-400" />
            <span>Schoolwide Bulletins & Official Notices</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements Feed</h1>
          <p className="text-rose-100/80 text-sm mt-1">
            Broadcast updates from Principal Office, Executive Administration, and Department Chairs.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {['all', 'urgent', 'normal', 'info'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                priorityFilter === p ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            No announcements found for this filter category.
          </div>
        ) : (
          filtered.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs transition-all hover:border-rose-200 ${
                ann.priority === 'urgent' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : ann.priority === 'normal'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {ann.priority === 'urgent' && <AlertCircle className="w-3 h-3" />}
                    <span>{ann.priority} Notice</span>
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    Audience: <strong className="text-slate-700 capitalize">{ann.targetAudience}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.date}</span>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg">{ann.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{ann.content}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Author: <strong className="text-slate-800 font-bold">{ann.authorName}</strong> ({ann.authorRole})
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
