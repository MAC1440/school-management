import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { User } from '../../types';

interface UserManagementProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedRoleFilter: string;
  setSelectedRoleFilter: (r: string) => void;
  onOpenUserModal: () => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  selectedRoleFilter,
  setSelectedRoleFilter,
  onOpenUserModal,
  onDeleteUser,
}) => {
  const roleBadgeStyle: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    principal: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    teacher: 'bg-primary/10 text-primary border-primary/30',
    student: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    staff: 'bg-slate-500/10 text-muted-foreground border-border',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-surface border border-border rounded-xl px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="principal">Principals</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <button
          onClick={onOpenUserModal}
          className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Account</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-surface-2 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Branch / Department</th>
                <th className="px-4 py-3">PIN</th>
                <th className="px-4 py-3">Base Salary</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-4 py-3 font-semibold flex items-center gap-2.5">
                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-border" />
                    <div>
                      <p className="text-foreground font-bold">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${roleBadgeStyle[u.role] || 'bg-surface-2 text-foreground border-border'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.branchName || 'Main Campus'} / {u.department || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-primary">
                    {u.pin || '----'}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                    {u.baseSalary ? `$${u.baseSalary}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 rounded-lg transition-colors"
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
    </div>
  );
};
