import { Router } from 'express';
import { admissions, branches, users } from '../db';
import { AdmissionApplication, User } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  res.json(admissions.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()));
});

router.post('/', (req, res) => {
  const appData: Partial<AdmissionApplication> = req.body;
  const selectedBranch = branches.find((b) => b.id === appData.branchId) || branches[0];

  const newApplication: AdmissionApplication = {
    id: `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
    studentName: appData.studentName || 'Applicant',
    dateOfBirth: appData.dateOfBirth || '2010-01-01',
    gradeApplying: appData.gradeApplying || 'Grade 10',
    branchId: selectedBranch.id,
    branchName: selectedBranch.name,
    parentName: appData.parentName || 'Parent',
    parentPhone: appData.parentPhone || '',
    parentEmail: appData.parentEmail || '',
    previousSchool: appData.previousSchool || 'N/A',
    address: appData.address || '',
    notes: appData.notes || '',
    status: 'pending',
    appliedAt: new Date().toISOString().split('T')[0],
  };

  admissions.unshift(newApplication);
  res.json({ success: true, application: newApplication });
});

router.post('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const targetAdm = admissions.find((a) => a.id === id);
  if (!targetAdm) {
    return res.status(404).json({ error: 'Admission application not found.' });
  }

  targetAdm.status = status;

  if (status === 'approved') {
    const studentIdNum = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudentUser: User = {
      id: `stu-${Date.now()}`,
      name: targetAdm.studentName,
      email: `${targetAdm.studentName.toLowerCase().replace(/\s+/g, '.')}@student.edupulse.edu`,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      gradeLevel: targetAdm.gradeApplying,
      branchId: targetAdm.branchId,
      branchName: targetAdm.branchName,
      studentIdNumber: studentIdNum,
      parentContact: targetAdm.parentPhone,
    };
    users.push(newStudentUser);
  }

  res.json({ success: true, application: targetAdm });
});

export default router;
