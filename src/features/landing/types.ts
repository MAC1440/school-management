export interface AdmissionApplication {
  id: string;
  studentName: string;
  dateOfBirth: string;
  gradeApplying: string;
  branchId: string;
  branchName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  previousSchool: string;
  address: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}
