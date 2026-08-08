export type Role = 'admin' | 'principal' | 'teacher' | 'student' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department?: string;
  branchId?: string;
  branchName?: string;
  pin?: string;
  baseSalary?: number;
  gradeLevel?: string;
  subjects?: string[];
  studentIdNumber?: string;
  parentContact?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
