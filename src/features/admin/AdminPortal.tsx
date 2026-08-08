import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Plus,
  Building2,
  DollarSign,
  FileSpreadsheet,
  CalendarDays,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Trash2,
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
} from '../../types';
import {
  useGetBranchesQuery,
  useGetRoomsQuery,
  useGetStaffAttendanceQuery,
  useGetAdmissionsQuery,
  useGetLeavesQuery,
  useGetCalendarConfigQuery,
  useSaveUserMutation,
  useDeleteUserMutation,
  useSaveBranchMutation,
  useDeleteBranchMutation,
  useSaveRoomMutation,
  useDeleteRoomMutation,
  useUpdateAdmissionStatusMutation,
  useUpdateLeaveStatusMutation,
  useSaveCalendarConfigMutation,
} from '../../store/apiSlice';
import { UserManagement } from './UserManagement';
import { BranchManagement } from './BranchManagement';

interface AdminPortalProps {
  users: User[];
  courses: Course[];
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ users = [], courses = [], onRefreshData }) => {
  const safeUsers = Array.isArray(users) ? users : [];

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    'users' | 'salary' | 'branches' | 'admissions' | 'leaves' | 'calendar'
  >('users');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // RTK Query hooks
  const { data: branchesList = [] } = useGetBranchesQuery();
  const { data: roomsList = [] } = useGetRoomsQuery();
  const { data: staffAttendanceLogs = [] } = useGetStaffAttendanceQuery();
  const { data: admissionsList = [] } = useGetAdmissionsQuery();
  const { data: leavesList = [] } = useGetLeavesQuery();
  const { data: calConfigData } = useGetCalendarConfigQuery();

  const [saveUserApi] = useSaveUserMutation();
  const [deleteUserApi] = useDeleteUserMutation();
  const [saveBranchApi] = useSaveBranchMutation();
  const [deleteBranchApi] = useDeleteBranchMutation();
  const [saveRoomApi] = useSaveRoomMutation();
  const [deleteRoomApi] = useDeleteRoomMutation();
  const [updateAdmissionApi] = useUpdateAdmissionStatusMutation();
  const [updateLeaveApi] = useUpdateLeaveStatusMutation();
  const [saveConfigApi] = useSaveCalendarConfigMutation();

  const calConfig: SchoolCalendarConfig = calConfigData || {
    totalWorkingDaysPerMonth: 22,
    perDayPenaltyRate: 150,
    holidays: [],
  };

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
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

  const filteredUsers = safeUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const staffAndTeachers = safeUsers.filter(
    (u) => u.role === 'teacher' || u.role === 'staff' || u.role === 'admin' || u.role === 'principal'
  );

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userFormData.name || !userFormData.email) return;
      const avatar =
        userFormData.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`;

      const selectedBranch = branchesList.find((b) => b.id === userFormData.branchId) || branchesList[0];

      await saveUserApi({
        ...userFormData,
        avatar,
        branchName: selectedBranch?.name || 'Main Campus',
      }).unwrap();

      setNotification(`User "${userFormData.name}" saved.`);
      setIsUserModalOpen(false);
      setUserFormData({ role: 'teacher', name: '', email: '', department: 'Science', gradeLevel: 'Grade 11', pin: '1234', baseSalary: 4500 });
      onRefreshData();
    } catch (err) {
      setNotification('Failed to save user record.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    const target = safeUsers.find((u) => u.id === id);
    if (!confirm(`Are you sure you want to delete user "${target?.name || id}"?`)) return;
    try {
      await deleteUserApi(id).unwrap();
      setNotification(`User removed from database.`);
      onRefreshData();
    } catch (err) {
      setNotification('Failed to delete user.');
    }
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchFormData.name || !branchFormData.code) return;
    try {
      await saveBranchApi(branchFormData).unwrap();
      setNotification(`Branch "${branchFormData.name}" saved.`);
      setIsBranchModalOpen(false);
      setBranchFormData({ code: '', name: '', address: '', phone: '', principalName: '' });
    } catch (err) {
      setNotification('Failed to save branch.');
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campus branch?')) return;
    try {
      await deleteBranchApi(id).unwrap();
      setNotification('Branch removed.');
    } catch (err) {
      setNotification('Failed to delete branch.');
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name || !roomFormData.roomNumber) return;
    try {
      await saveRoomApi(roomFormData).unwrap();
      setNotification(`Room "${roomFormData.roomNumber}" saved.`);
      setIsRoomModalOpen(false);
      setRoomFormData({ branchId: 'br-1', roomNumber: '', name: '', capacity: 30, type: 'classroom' });
    } catch (err) {
      setNotification('Failed to save room.');
    }
  };

  const handleAdmissionAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateAdmissionApi({ id, status }).unwrap();
      setNotification(`Admission application ${status.toUpperCase()}.`);
      onRefreshData();
    } catch (err) {
      setNotification('Failed to update admission status.');
    }
  };

  const handleLeaveAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateLeaveApi({ id, status }).unwrap();
      setNotification(`Leave request ${status.toUpperCase()}.`);
    } catch (err) {
      setNotification('Failed to update leave request.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sidebar via-primary to-surface-2 rounded-2xl p-6 text-primary-foreground shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Admin Operations & Governance</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Master School Administration</h1>
            <p className="text-primary-foreground/80 text-xs sm:text-sm mt-1 max-w-2xl">
              Provision staff, manage multi-branch campuses, calculate monthly teacher salaries based on attendance & working days, process student admissions, and review leave applications.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="bg-surface text-foreground hover:bg-surface-2 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Provision Staff / User</span>
            </button>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Add Campus Branch</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-surface border border-primary/30 text-primary text-xs font-semibold rounded-xl flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Sub-Tabs Header */}
      <div className="flex items-center space-x-1 border-b border-border overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`pb-2.5 px-3 border-b-2 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeAdminSubTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({safeUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('branches')}
          className={`pb-2.5 px-3 border-b-2 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeAdminSubTab === 'branches'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Campuses ({branchesList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('salary')}
          className={`pb-2.5 px-3 border-b-2 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeAdminSubTab === 'salary'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Staff Payroll & Kiosk Attendance</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('admissions')}
          className={`pb-2.5 px-3 border-b-2 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeAdminSubTab === 'admissions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Online Admissions ({admissionsList.filter((a) => a.status === 'pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('leaves')}
          className={`pb-2.5 px-3 border-b-2 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeAdminSubTab === 'leaves'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Leave Applications</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('calendar')}
          className={`pb-2.5 px-3 border-b-2 text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeAdminSubTab === 'calendar'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Calendar & Penalty Config</span>
        </button>
      </div>

      {/* SUB-TAB 1: USERS MANAGEMENT */}
      {activeAdminSubTab === 'users' && (
        <UserManagement
          users={filteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRoleFilter={selectedRoleFilter}
          setSelectedRoleFilter={setSelectedRoleFilter}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* SUB-TAB 2: BRANCHES */}
      {activeAdminSubTab === 'branches' && (
        <BranchManagement
          branches={branchesList}
          onOpenBranchModal={() => setIsBranchModalOpen(true)}
          onDeleteBranch={handleDeleteBranch}
        />
      )}

      {/* SUB-TAB 3: PAYROLL & SALARIES */}
      {activeAdminSubTab === 'salary' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Staff Monthly Payroll & Working Days Deduction Engine
            </h3>
            <p className="text-xs text-muted-foreground">
              Calculates salary reductions based on total monthly working days ({calConfig.totalWorkingDaysPerMonth} days) vs Kiosk check-ins. Penalty per missing day: ${calConfig.perDayPenaltyRate}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-surface-2 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="px-4 py-3">Staff Member</th>
                  <th className="px-4 py-3">Role / Branch</th>
                  <th className="px-4 py-3">Base Monthly Salary</th>
                  <th className="px-4 py-3">Kiosk Days Attended</th>
                  <th className="px-4 py-3">Days Absent</th>
                  <th className="px-4 py-3">Deduction Penalty</th>
                  <th className="px-4 py-3 font-bold text-right">Net Payable Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staffAndTeachers.map((staff) => {
                  const attendedCount = staffAttendanceLogs.filter((s) => s.staffId === staff.id && (s.status === 'present' || (s.status as string) === 'check_in')).length || 18;
                  const missingDays = Math.max(0, calConfig.totalWorkingDaysPerMonth - attendedCount);
                  const penalty = missingDays * calConfig.perDayPenaltyRate;
                  const baseSalary = staff.baseSalary || 4500;
                  const netSalary = Math.max(0, baseSalary - penalty);

                  return (
                    <tr key={staff.id} className="hover:bg-surface-2/50 transition-colors">
                      <td className="px-4 py-3 font-bold flex items-center gap-2">
                        <img src={staff.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-border" />
                        <div>
                          <p>{staff.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">PIN: {staff.pin || '1234'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground uppercase text-[10px] font-bold">
                        {staff.role} | {staff.branchName || 'Main Campus'}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">${baseSalary}</td>
                      <td className="px-4 py-3 font-mono text-emerald-600 font-bold">{attendedCount} / {calConfig.totalWorkingDaysPerMonth} days</td>
                      <td className="px-4 py-3 font-mono text-rose-600 font-bold">{missingDays} days</td>
                      <td className="px-4 py-3 font-mono text-rose-600 font-bold">-${penalty}</td>
                      <td className="px-4 py-3 font-mono font-bold text-right text-emerald-600 text-sm">${netSalary}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ADMISSIONS */}
      {activeAdminSubTab === 'admissions' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Online Student Admission Applications
              </h3>
              <p className="text-xs text-muted-foreground">Review incoming student enrollment requests from online portal forms.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-surface-2 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="px-4 py-3">Applicant Name</th>
                  <th className="px-4 py-3">Grade Requested</th>
                  <th className="px-4 py-3">Parent / Guardian Info</th>
                  <th className="px-4 py-3">Campus Preferred</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Decision Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admissionsList.map((adm) => (
                  <tr key={adm.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground">{adm.studentName}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{adm.gradeApplying}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p className="font-bold text-foreground">{adm.parentName}</p>
                      <p className="text-[10px]">{adm.parentPhone} • {adm.parentEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{adm.branchId || 'Main Campus'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        adm.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : adm.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                      }`}>
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {adm.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAdmissionAction(adm.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAdmissionAction(adm.id, 'rejected')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] shadow-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: LEAVES */}
      {activeAdminSubTab === 'leaves' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Faculty & Staff Leave Applications
            </h3>
            <p className="text-xs text-muted-foreground">Approve or reject leave requests submitted by school teachers and staff.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-surface-2 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="px-4 py-3">Applicant Name</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leavesList.map((lv) => (
                  <tr key={lv.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground">{lv.applicantName}</td>
                    <td className="px-4 py-3 uppercase text-[10px] font-bold text-primary">{lv.leaveType}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{lv.startDate} to {lv.endDate}</td>
                    <td className="px-4 py-3 text-muted-foreground italic max-w-xs truncate">{lv.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lv.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : lv.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                      }`}>
                        {lv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {lv.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleLeaveAction(lv.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveAction(lv.id, 'rejected')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px]"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: CALENDAR CONFIG */}
      {activeAdminSubTab === 'calendar' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2 pb-3 border-b border-border">
            <CalendarDays className="w-5 h-5 text-primary" />
            School Calendar & Penalty Calculation Settings
          </h3>

          <form onSubmit={async (e) => {
            e.preventDefault();
            await saveConfigApi(calConfig).unwrap();
            setNotification('Calendar config updated.');
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Total Expected Working Days Per Month</label>
              <input
                type="number"
                value={calConfig.totalWorkingDaysPerMonth}
                onChange={(e) => saveConfigApi({ ...calConfig, totalWorkingDaysPerMonth: Number(e.target.value) })}
                className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Per-Day Absence Penalty Rate ($)</label>
              <input
                type="number"
                value={calConfig.perDayPenaltyRate}
                onChange={(e) => saveConfigApi({ ...calConfig, perDayPenaltyRate: Number(e.target.value) })}
                className="w-full bg-surface border border-border rounded-xl p-2.5 text-xs text-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Configuration Settings
            </button>
          </form>
        </div>
      )}

      {/* User Provision Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-base">Provision New User Account</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                  placeholder="e.g. Dr. Arthur Pendelton"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                  placeholder="e.g. a.pendelton@edupulse.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Role</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                    className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                  >
                    <option value="admin">Admin</option>
                    <option value="principal">Principal</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">4-Digit PIN Code</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={userFormData.pin}
                    onChange={(e) => setUserFormData({ ...userFormData, pin: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Campus Branch</label>
                  <select
                    value={userFormData.branchId}
                    onChange={(e) => setUserFormData({ ...userFormData, branchId: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                  >
                    {branchesList.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Base Monthly Salary ($)</label>
                  <input
                    type="number"
                    value={userFormData.baseSalary}
                    onChange={(e) => setUserFormData({ ...userFormData, baseSalary: Number(e.target.value) })}
                    className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-md"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-foreground text-base">Add New Campus Branch</h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={branchFormData.name}
                  onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                  placeholder="e.g. North River Campus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={branchFormData.code}
                    onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl p-2 text-xs font-mono font-bold uppercase text-foreground"
                    placeholder="e.g. NRC-03"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Principal Name</label>
                  <input
                    type="text"
                    value={branchFormData.principalName}
                    onChange={(e) => setBranchFormData({ ...branchFormData, principalName: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                    placeholder="e.g. Dr. Sarah Jenkins"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Address</label>
                <input
                  type="text"
                  value={branchFormData.address}
                  onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl p-2 text-xs text-foreground"
                  placeholder="e.g. 104 Academic Blvd"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-md"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
