import { Role } from '../auth/types';

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  role?: Role;
  applicantRole?: Role;
  branchId?: string;
  startDate: string;
  endDate: string;
  leaveType: 'sick' | 'casual' | 'vacation' | 'maternity' | 'unpaid';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}
