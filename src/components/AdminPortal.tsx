import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Plus,
  Search,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
  XCircle,
  X,
  Building2,
  DollarSign,
  FileSpreadsheet,
  Check,
  Key,
  Clock,
  Briefcase,
  AlertCircle,
  Edit2,
  CalendarDays,
} from 'lucide-react';
import {
  User,
  Course,
  Branch,
  Room,
  StaffAttendanceRecord,
  AdmissionApplication,
  LeaveApplication,
  SchoolCalendarConfig,
  Role,
} from '../types';
import {
  saveUser,
  deleteUser,
  saveCourse,
  fetchBranches,
  saveBranch,
  deleteBranch,
  fetchRooms,
  saveRoom,
  deleteRoom,
  fetchStaffAttendance,
  fetchCalendarConfig,
  saveCalendarConfig,
  fetchAdmissions,
  updateAdmissionStatus,
  fetchLeaves,
  updateLeaveStatus,
} from '../lib/api';

interface AdminPortalProps {
  users: User[];
  courses: Course[];
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ users = [], courses = [], onRefreshData }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    'users' | 'salary' | 'branches' | 'admissions' | 'leaves' | 'calendar'
  >('users');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Data states
  const [branchesList, setBranchesList] = useState<Branch[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [staffAttendanceLogs, setStaffAttendanceLogs] = useState<StaffAttendanceRecord[]>([]);
  const [admissionsList, setAdmissionsList] = useState<AdmissionApplication[]>([]);
  const [leavesList, setLeavesList] = useState<LeaveApplication[]>([]);
  const [calConfig, setCalConfig] = useState<SchoolCalendarConfig>({
    totalWorkingDaysPerMonth: 22,
    perDayPenaltyRate: 150,
    holidays: [],
  });

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Form states
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    role: 'teacher',
    name: '',
    email: '',
    department: 'Science & Mathematics',
    gradeLevel: 'Grade 11',
    branchId: 'br-1',
    pin: '1234',
    baseSalary: 4500,
  });

  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({
    code: '',
    name: '',
    department: 'Science & Mathematics',
    teacherId: '',
    teacherName: '',
    room: 'Room 101',
    gradeLevel: 'Grade 11',
    color: 'emerald',
  });

  const [branchFormData, setBranchFormData] = useState<Partial<Branch>>({
    code: '',
    name: '',
    address: '',
    phone: '',
    principalName: '',
  });

  const [roomFormData, setRoomFormData] = useState<Partial<Room>>({
    branchId: 'br-1',
    roomNumber: '',
    name: '',
    capacity: 30,
    type: 'classroom',
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const brs = await fetchBranches();
      setBranchesList(Array.isArray(brs) ? brs : []);

      const rms = await fetchRooms();
      setRoomsList(Array.isArray(rms) ? rms : []);

      const sa = await fetchStaffAttendance();
      setStaffAttendanceLogs(Array.isArray(sa) ? sa : []);

      const adms = await fetchAdmissions();
      setAdmissionsList(Array.isArray(adms) ? adms : []);

      const lvs = await fetchLeaves();
      setLeavesList(Array.isArray(lvs) ? lvs : []);

      const cfg = await fetchCalendarConfig();
      if (cfg) setCalConfig(cfg);
    } catch (err) {
      console.error('Error loading admin sub-data:', err);
    }
  };

  const filteredUsers = safeUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const teachersList = safeUsers.filter((u) => u.role === 'teacher');
  const staffAndTeachers = safeUsers.filter((u) => u.role === 'teacher' || u.role === 'staff' || u.role === 'admin' || u.role === 'principal');

  // Save User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userFormData.name || !userFormData.email) return;
      const avatar =
        userFormData.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`;

      const selectedBranch = branchesList.find((b) => b.id === userFormData.branchId) || branchesList[0];

      await saveUser({
        ...userFormData,
        avatar,
        branchName: selectedBranch?.name || 'Main Campus',
      });

      setNotification(`User "${userFormData.name}" created/updated with PIN ${userFormData.pin || '1234'}.`);
      setIsUserModalOpen(false);
      setUserFormData({ role: 'teacher', name: '', email: '', department: 'Science', gradeLevel: 'Grade 11', pin: '1234', baseSalary: 4500 });
      onRefreshData();
    } catch (err) {
      setNotification('Failed to save user record.');
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      setNotification(`User "${name}" removed from database.`);
      onRefreshData();
    } catch (err) {
      setNotification('Failed to delete user.');
    }
  };

  // Save Branch
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchFormData.name || !branchFormData.code) return;
    try {
      await saveBranch(branchFormData);
      setNotification(`Branch "${branchFormData.name}" successfully saved.`);
      setIsBranchModalOpen(false);
      setBranchFormData({ code: '', name: '', address: '', phone: '', principalName: '' });
      loadAdminData();
    } catch (err) {
      setNotification('Failed to save branch.');
    }
  };

  // Save Room
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name || !roomFormData.roomNumber) return;
    try {
      await saveRoom(roomFormData);
      setNotification(`Room "${roomFormData.roomNumber}" saved.`);
      setIsRoomModalOpen(false);
      setRoomFormData({ branchId: 'br-1', roomNumber: '', name: '', capacity: 30, type: 'classroom' });
      loadAdminData();
    } catch (err) {
      setNotification('Failed to save room.');
    }
  };

  // Process Admission Status
  const handleAdmissionAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateAdmissionStatus(id, status);
      setNotification(`Admission application ${status.toUpperCase()}! Student user record generated if approved.`);
      loadAdminData();
      onRefreshData();
    } catch (err) {
      setNotification('Failed to update admission status.');
    }
  };

  // Process Leave Request
  const handleLeaveAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateLeaveStatus(id, status);
      setNotification(`Leave request ${status.toUpperCase()}.`);
      loadAdminData();
    } catch (err) {
      setNotification('Failed to update leave request.');
    }
  };

  // Save Calendar Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveCalendarConfig(calConfig);
      setNotification('Calendar & Salary Deduction parameters updated.');
      loadAdminData();
    } catch (err) {
      setNotification('Failed to update calendar configuration.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Operations & Governance</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Master School Administration</h1>
            <p className="text-purple-200/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Provision staff, manage multi-branch campuses, calculate monthly teacher salaries based on attendance & working days, process student admissions, and review leave applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Staff / User</span>
            </button>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="bg-purple-600/80 hover:bg-purple-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all border border-purple-400/30 flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Add Branch</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminSubTab === 'users'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('salary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminSubTab === 'salary'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Staff Attendance & Salary Calculator</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('branches')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminSubTab === 'branches'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Branches & Classrooms ({branchesList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('admissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminSubTab === 'admissions'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Pending Admissions ({admissionsList.filter((a) => a.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('leaves')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminSubTab === 'leaves'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Leave Requests ({leavesList.filter((l) => l.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminSubTab === 'calendar'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Working Days & Penalty Config</span>
        </button>
      </div>

      {/* --- TAB 1: USER DIRECTORY & PROVISIONING --- */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">User Directory & Staff Credentials</h3>
              <p className="text-xs text-slate-500">Manage credentials, Kiosk PIN codes, assigned branch, and roles</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 w-60"
                />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
                {['all', 'teacher', 'staff', 'admin', 'principal', 'student'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                      selectedRoleFilter === role
                        ? 'bg-white text-purple-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">User & PIN</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Branch & Dept</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[10px] text-purple-700 font-mono">PIN: {user.pin || '1234'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-slate-100 text-slate-700">
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>{user.branchName || 'Main Campus'}</div>
                      <div className="text-[10px] text-slate-400">{user.department || user.gradeLevel}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                      {user.baseSalary ? `$${user.baseSalary}/mo` : 'N/A'}
                    </td>

                    <td className="py-3 px-4 text-slate-500">{user.email}</td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: STAFF SALARY & ATTENDANCE CALCULATOR --- */}
      {activeAdminSubTab === 'salary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Staff Payroll & Attendance Summary</h3>
                <p className="text-xs text-slate-500">
                  Calculates net monthly salary based on {calConfig.totalWorkingDaysPerMonth} total working days and penalty deductions (${calConfig.perDayPenaltyRate}/day unexcused absence).
                </p>
              </div>

              <div className="text-xs bg-purple-50 text-purple-800 border border-purple-200 px-3.5 py-2 rounded-xl font-mono">
                Working Days: <strong>{calConfig.totalWorkingDaysPerMonth}</strong> | Penalty: <strong>${calConfig.perDayPenaltyRate}/day</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">Days Present</th>
                    <th className="py-3 px-4">Absences</th>
                    <th className="py-3 px-4">Base Salary</th>
                    <th className="py-3 px-4">Deductions</th>
                    <th className="py-3 px-4">Calculated Net Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {staffAndTeachers.map((st) => {
                    const stLogs = staffAttendanceLogs.filter((l) => l.staffId === st.id);
                    const presentCount = stLogs.filter((l) => l.status === 'present' || l.status === 'tardy').length || 21;
                    const absentCount = stLogs.filter((l) => l.status === 'absent').length || 1;
                    const baseSalary = st.baseSalary || 4800;
                    const deduction = absentCount * calConfig.perDayPenaltyRate;
                    const netSalary = Math.max(0, baseSalary - deduction);

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div>{st.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{st.role}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{st.branchName || 'Main Campus'}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">{presentCount} / {calConfig.totalWorkingDaysPerMonth}</td>
                        <td className="py-3 px-4 font-bold text-rose-600">{absentCount} days</td>
                        <td className="py-3 px-4 font-mono">${baseSalary.toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-rose-600">-${deduction}</td>
                        <td className="py-3 px-4 font-mono font-extrabold text-slate-900 text-sm bg-slate-50/60">
                          ${netSalary.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: BRANCHES & ROOMS --- */}
      {activeAdminSubTab === 'branches' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Campus Branches</h3>
                <p className="text-xs text-slate-500">Multi-branch physical locations</p>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
              >
                + Add Campus Branch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branchesList.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">{b.code}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{b.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{b.address}</p>
                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-200 flex justify-between">
                    <span>Principal: <strong>{b.principalName}</strong></span>
                    <span>Phone: <strong>{b.phone}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Classroom & Lab Facilities</h3>
                <p className="text-xs text-slate-500">Capacity and facility allocation</p>
              </div>
              <button
                onClick={() => setIsRoomModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100"
              >
                + Add Room / Lab
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {roomsList.map((rm) => (
                <div key={rm.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-xs">Room {rm.roomNumber}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">{rm.type}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{rm.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Capacity: {rm.capacity} seats</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: PENDING ADMISSIONS QUEUE --- */}
      {activeAdminSubTab === 'admissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Online Admission Submissions</h3>
            <p className="text-xs text-slate-500">Review prospective student applications. Approving generates an active student record in the system.</p>
          </div>

          <div className="space-y-3">
            {admissionsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No admission applications received yet.</p>
            ) : (
              admissionsList.map((adm) => (
                <div key={adm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{adm.id}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        adm.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : adm.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {adm.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">• Applied: {adm.appliedAt}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{adm.studentName} ({adm.gradeApplying})</h4>
                    <p className="text-xs text-slate-600">
                      Parent: <strong>{adm.parentName}</strong> ({adm.parentPhone} • {adm.parentEmail})
                    </p>
                    <p className="text-xs text-slate-500">Campus: <strong>{adm.branchName}</strong> | Previous School: {adm.previousSchool}</p>
                    {adm.notes && <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 mt-1">{adm.notes}</p>}
                  </div>

                  {adm.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAdmissionAction(adm.id, 'approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Admission</span>
                      </button>

                      <button
                        onClick={() => handleAdmissionAction(adm.id, 'rejected')}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: LEAVE REQUESTS --- */}
      {activeAdminSubTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Staff & Faculty Leave Applications</h3>
            <p className="text-xs text-slate-500">Review time-off requests submitted by teachers and staff members.</p>
          </div>

          <div className="space-y-3">
            {leavesList.map((lv) => (
              <div key={lv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{lv.applicantName}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">{lv.leaveType} leave</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      lv.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : lv.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lv.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Dates: <strong>{lv.startDate}</strong> to <strong>{lv.endDate}</strong></p>
                  <p className="text-xs text-slate-500 mt-1 bg-white p-2 rounded border border-slate-200">{lv.reason}</p>
                </div>

                {lv.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLeaveAction(lv.id, 'approved')}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleLeaveAction(lv.id, 'rejected')}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-rose-100 hover:text-rose-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: CALENDAR & WORKING DAYS CONFIG --- */}
      {activeAdminSubTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl">
          <h3 className="font-bold text-slate-900 text-lg mb-1">Calendar & Payroll Rules</h3>
          <p className="text-xs text-slate-500 mb-6">Configure expected monthly working days and penalty rate per unexcused absence.</p>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Working Days per Month</label>
              <input
                type="number"
                value={calConfig.totalWorkingDaysPerMonth}
                onChange={(e) => setCalConfig({ ...calConfig, totalWorkingDaysPerMonth: parseInt(e.target.value) || 22 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Penalty Deduction per Absence ($)</label>
              <input
                type="number"
                value={calConfig.perDayPenaltyRate}
                onChange={(e) => setCalConfig({ ...calConfig, perDayPenaltyRate: parseInt(e.target.value) || 150 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
            >
              Save Configuration Rules
            </button>
          </form>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* User Provisioning Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Provision User / Staff Member</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role *</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as Role })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                >
                  <option value="teacher">Teacher</option>
                  <option value="staff">Office Staff / Registrar</option>
                  <option value="principal">Principal</option>
                  <option value="admin">Administrator</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="r.adams@edupulse.edu"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4-Digit Kiosk PIN *</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={userFormData.pin}
                    onChange={(e) => setUserFormData({ ...userFormData, pin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Monthly Salary ($)</label>
                  <input
                    type="number"
                    placeholder="4500"
                    value={userFormData.baseSalary}
                    onChange={(e) => setUserFormData({ ...userFormData, baseSalary: parseInt(e.target.value) || 4000 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch / Campus</label>
                <select
                  value={userFormData.branchId}
                  onChange={(e) => setUserFormData({ ...userFormData, branchId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  {branchesList.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Campus Branch</h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    placeholder="EAST-03"
                    value={branchFormData.code}
                    onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-1111"
                    value={branchFormData.phone}
                    onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Science Annex"
                  value={branchFormData.name}
                  onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Address..."
                  value={branchFormData.address}
                  onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Principal Name</label>
                <input
                  type="text"
                  placeholder="Dr. John Doe"
                  value={branchFormData.principalName}
                  onChange={(e) => setBranchFormData({ ...branchFormData, principalName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Facility / Room</h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Branch</label>
                <select
                  value={roomFormData.branchId}
                  onChange={(e) => setRoomFormData({ ...roomFormData, branchId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  {branchesList.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="Lab 102"
                    value={roomFormData.roomNumber}
                    onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={roomFormData.capacity}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacity: parseInt(e.target.value) || 30 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics & Robotics Lab"
                  value={roomFormData.name}
                  onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
