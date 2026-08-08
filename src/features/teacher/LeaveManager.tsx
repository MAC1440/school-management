import React, { useState } from 'react';
import { Briefcase, Send, Check } from 'lucide-react';

interface LeaveManagerProps {
  onSubmitLeave: (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => void;
  leaveSubmitted: boolean;
}

export const LeaveManager: React.FC<LeaveManagerProps> = ({ onSubmitLeave, leaveSubmitted }) => {
  const [leaveType, setLeaveType] = useState('casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    onSubmitLeave({ leaveType, startDate, endDate, reason });
    setReason('');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Briefcase className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-bold text-foreground text-base">Submit Formal Leave Application</h3>
          <p className="text-xs text-muted-foreground">Requests sent directly to Principal & Admin workflow.</p>
        </div>
      </div>

      {leaveSubmitted && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Leave application submitted successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground font-medium"
          >
            <option value="casual">Casual Leave</option>
            <option value="sick">Medical / Sick Leave</option>
            <option value="emergency">Emergency Absence</option>
            <option value="unpaid">Unpaid Personal</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">Reason for Absence</label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground"
            placeholder="Specify reason..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit Application</span>
        </button>
      </form>
    </div>
  );
};
