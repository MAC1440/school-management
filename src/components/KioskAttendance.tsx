import React, { useState, useEffect } from 'react';
import {
  Clock,
  Building2,
  Search,
  CheckCircle2,
  Lock,
  ArrowLeft,
  X,
  AlertCircle,
  UserCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Branch, User, StaffAttendanceRecord } from '../types';
import { fetchUsers, fetchStaffAttendance, verifyKioskPin } from '../lib/api';

interface KioskAttendanceProps {
  branches: Branch[];
  onBack: () => void;
}

export const KioskAttendance: React.FC<KioskAttendanceProps> = ({ branches = [], onBack }) => {
  const safeBranches = Array.isArray(branches) ? branches : [];
  const [selectedBranchId, setSelectedBranchId] = useState<string>(safeBranches[0]?.id || 'br-1');
  const [staffList, setStaffList] = useState<User[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<StaffAttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  
  // PIN Pad state
  const [pinCode, setPinCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBanner, setSuccessBanner] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    loadBranchStaff();
  }, [selectedBranchId]);

  const loadBranchStaff = async () => {
    try {
      const allUsers = await fetchUsers();
      // Filter for teachers, admins, principals, and staff assigned to selected branch
      const filtered = (Array.isArray(allUsers) ? allUsers : []).filter(
        (u) =>
          u.role !== 'student' &&
          (!u.branchId || u.branchId === selectedBranchId)
      );
      setStaffList(filtered);

      const todayStr = new Date().toISOString().split('T')[0];
      const logs = await fetchStaffAttendance(selectedBranchId, todayStr);
      setAttendanceLogs(Array.isArray(logs) ? logs : []);
    } catch (err) {
      console.error('Error loading kiosk staff:', err);
    }
  };

  const handleDigitClick = (num: string) => {
    if (pinCode.length < 4) {
      setPinCode((prev) => prev + num);
      setErrorMsg('');
    }
  };

  const handleClearPin = () => {
    setPinCode('');
    setErrorMsg('');
  };

  const handleVerifyPin = async () => {
    if (!selectedStaff) return;
    if (pinCode.length !== 4) {
      setErrorMsg('Please enter a 4-digit PIN code.');
      return;
    }

    setVerifying(true);
    setErrorMsg('');

    try {
      const res = await verifyKioskPin(selectedStaff.id, pinCode, selectedBranchId);
      setSuccessBanner({ name: res.staffName, time: res.checkInTime });
      setSelectedStaff(null);
      setPinCode('');
      
      // Refresh attendance logs
      await loadBranchStaff();

      // Auto dismiss success banner after 5s
      setTimeout(() => {
        setSuccessBanner(null);
      }, 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect PIN code. Default PIN is 1234 or set by admin.');
    } finally {
      setVerifying(false);
    }
  };

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 selection:bg-amber-500 selection:text-slate-900">
      
      {/* Kiosk Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Staff Kiosk Attendance Terminal
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Daily Staff Check-In</h1>
          </div>
        </div>

        {/* Date & Branch Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono">
            {todayDateStr}
          </div>

          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              {safeBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="max-w-6xl mx-auto mt-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 flex items-center justify-between shadow-lg shadow-emerald-500/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Attendance Recorded Successfully!</p>
              <p className="text-xs text-emerald-200 mt-0.5">
                <strong>{successBanner.name}</strong> checked in today at <strong>{successBanner.time}</strong>.
              </p>
            </div>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto mt-8">
        
        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search staff member name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>Branch: <strong className="text-white">{selectedBranch?.name}</strong></span>
            <span>Total Staff: <strong className="text-amber-400">{staffList.length}</strong></span>
            <span>Checked-In Today: <strong className="text-emerald-400">{attendanceLogs.length}</strong></span>
          </div>
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStaff.map((staff) => {
            const isCheckedIn = attendanceLogs.some((l) => l.staffId === staff.id);
            const checkInRecord = attendanceLogs.find((l) => l.staffId === staff.id);

            return (
              <div
                key={staff.id}
                onClick={() => {
                  setSelectedStaff(staff);
                  setPinCode('');
                  setErrorMsg('');
                }}
                className={`group cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                  isCheckedIn
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400"
                    />
                    {isCheckedIn ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">{staff.role} • {staff.department || 'Staff'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  {isCheckedIn ? (
                    <span className="text-emerald-400 font-mono">Time: {checkInRecord?.checkInTime}</span>
                  ) : (
                    <span className="text-slate-500 group-hover:text-amber-400">Tap to Enter PIN</span>
                  )}
                  <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* PIN Verification Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedStaff(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <img
                src={selectedStaff.avatar}
                alt={selectedStaff.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 mx-auto"
              />
              <h3 className="text-lg font-bold text-white">{selectedStaff.name}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{selectedStaff.role} • {selectedStaff.department}</p>
              <p className="text-xs text-amber-400 font-mono">Enter 4-Digit Security PIN</p>
            </div>

            {/* PIN Dots Indicator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pinCode.length > index
                      ? 'bg-amber-400 border-amber-400 shadow-md shadow-amber-400/30'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitClick(digit)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 text-white font-bold text-lg transition-all border border-slate-700/60"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="py-3 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white font-semibold text-xs"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleDigitClick('0')}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700/60"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleVerifyPin}
                disabled={pinCode.length !== 4 || verifying}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                {verifying ? '...' : 'OK'}
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Default test PINs: Prof. Elena (1111), Dr. Vance (2222), Dr. Robert (3333), Ms. Maya (4444), Admin (1234)
            </p>

          </div>
        </div>
      )}

    </div>
  );
};
