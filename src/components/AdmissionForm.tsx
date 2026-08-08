import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ArrowLeft,
  CheckCircle2,
  Building2,
  User,
  Calendar,
  Phone,
  Mail,
  School,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { Branch, AdmissionApplication } from '../types';
import { submitAdmissionForm } from '../lib/api';

interface AdmissionFormProps {
  branches: Branch[];
  onBack: () => void;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ branches = [], onBack }) => {
  const safeBranches = Array.isArray(branches) ? branches : [];
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gradeApplying: 'Grade 11',
    branchId: safeBranches[0]?.id || 'br-1',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    previousSchool: '',
    address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentName || !formData.parentPhone) {
      setErrorMsg('Please fill in required fields: Student Name, Parent Name, and Parent Phone.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await submitAdmissionForm(formData);
      setSubmittedApp(res.application);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Back Navigation */}
        <button
          id="admission-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        {submittedApp ? (
          /* Confirmation Receipt Card */
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                Application Status: Pending Admin Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                Admission Application Submitted!
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto">
                Thank you, <strong>{submittedApp.parentName}</strong>. Your child's application for <strong>{submittedApp.studentName}</strong> has been received by our Admissions Office.
              </p>
            </div>

            {/* Application ID Card */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-6 text-left max-w-md mx-auto space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tracking Reference ID:</span>
                <span className="text-blue-400 font-bold text-sm">{submittedApp.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Student Name:</span>
                <span className="text-slate-200">{submittedApp.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Grade Applying For:</span>
                <span className="text-slate-200">{submittedApp.gradeApplying}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Campus Selected:</span>
                <span className="text-slate-200">{submittedApp.branchName}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSubmittedApp(null);
                  setFormData({
                    studentName: '',
                    dateOfBirth: '',
                    gradeApplying: 'Grade 11',
                    branchId: branches[0]?.id || 'br-1',
                    parentName: '',
                    parentPhone: '',
                    parentEmail: '',
                    previousSchool: '',
                    address: '',
                    notes: '',
                  });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-all"
              >
                Submit Another Application
              </button>

              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Application Form Card */
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl">
            
            {/* Header */}
            <div className="border-b border-slate-700 pb-6 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Online Application Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Admission Request</h1>
              <p className="text-slate-400 text-sm mt-1">
                Fill out the application details below to submit a registration entry for review by our school administration.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Branch & Grade Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Campus / Branch Preference *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <select
                      id="admission-branch-select"
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                      {safeBranches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Grade Applying For *
                  </label>
                  <select
                    id="admission-grade-select"
                    value={formData.gradeApplying}
                    onChange={(e) => setFormData({ ...formData, gradeApplying: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-4 pt-2 border-t border-slate-700/60">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Student Profile Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Student Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="admission-student-name"
                        type="text"
                        placeholder="e.g. Marcus Vance"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="admission-dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Details */}
              <div className="space-y-4 pt-2 border-t border-slate-700/60">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Parent / Guardian Contact</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Parent / Guardian Name *</label>
                    <input
                      id="admission-parent-name"
                      type="text"
                      placeholder="e.g. Harrison Vance"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="admission-parent-phone"
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Parent Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="admission-parent-email"
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Background & Notes */}
              <div className="space-y-4 pt-2 border-t border-slate-700/60">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Academic Background & Address</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Previous School Attended</label>
                    <div className="relative">
                      <School className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="admission-prev-school"
                        type="text"
                        placeholder="e.g. St. Jude Academy"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Residential Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="admission-address"
                        type="text"
                        placeholder="e.g. 100 Main St, District 4"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Additional Notes / Achievements</label>
                  <textarea
                    id="admission-notes"
                    rows={3}
                    placeholder="Provide any additional context, academic distinctions, or special needs..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-700">
                <button
                  id="submit-admission-form-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Application</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
