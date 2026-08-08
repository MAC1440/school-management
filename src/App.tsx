import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { AdmissionForm } from './components/AdmissionForm';
import { KioskAttendance } from './components/KioskAttendance';
import { AdminPortal } from './components/AdminPortal';
import { PrincipalPortal } from './components/PrincipalPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { StudentPortal } from './components/StudentPortal';
import { SharedScheduleView } from './components/SharedScheduleView';
import { SharedAnnouncements } from './components/SharedAnnouncements';

import {
  User,
  Course,
  ScheduleItem,
  AttendanceRecord,
  GradeRecord,
  Announcement,
  SchoolStats,
  Branch,
} from './types';

import {
  fetchUsers,
  fetchCourses,
  fetchSchedule,
  fetchAttendance,
  fetchGrades,
  fetchAnnouncements,
  fetchSchoolStats,
  fetchBranches,
  fetchCurrentUserWithJwt,
  resetDatabase,
} from './lib/api';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<SchoolStats | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'admission' | 'kiosk' | 'portal'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const loadAllData = async () => {
    try {
      const [uList, cList, bList, sList, aList, gList, annList, statsData] = await Promise.all([
        fetchUsers(),
        fetchCourses(),
        fetchBranches(),
        fetchSchedule(),
        fetchAttendance(),
        fetchGrades(),
        fetchAnnouncements(),
        fetchSchoolStats(),
      ]);

      setUsers(uList);
      setCourses(cList);
      setBranches(bList);
      setSchedule(sList);
      setAttendance(aList);
      setGrades(gList);
      setAnnouncements(annList);
      setStats(statsData);

      // Check if JWT token exists in localStorage
      const token = localStorage.getItem('edupulse_jwt');
      if (token) {
        try {
          const authRes = await fetchCurrentUserWithJwt();
          setCurrentUser(authRes);
        } catch (err) {
          localStorage.removeItem('edupulse_jwt');
        }
      }

      if (!currentUser && uList.length > 0) {
        const principalUser = uList.find((u) => u.role === 'principal') || uList[0];
        setCurrentUser(principalUser);
      }
    } catch (err) {
      console.error('Failed to load school data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleResetData = async () => {
    if (!confirm('Reset shared school database to initial seed data?')) return;
    setIsResetting(true);
    try {
      await resetDatabase();
      await loadAllData();
    } catch (err) {
      alert('Error resetting database');
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edupulse_jwt');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold tracking-wide text-blue-300">
          Loading EduPulse Institutional Portal OS...
        </p>
      </div>
    );
  }

  // --- TOP-LEVEL VIEW ROUTING ---

  // 1. Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        branches={branches}
        onNavigate={(view) => setCurrentView(view)}
        onGoToAuth={() => setCurrentView('auth')}
        onGoToAdmission={() => setCurrentView('admission')}
        onGoToKiosk={() => setCurrentView('kiosk')}
        onGoToPortal={(user) => {
          if (user) setCurrentUser(user);
          setCurrentView('portal');
        }}
        currentUser={currentUser}
      />
    );
  }

  // 2. Auth Page (JWT Login)
  if (currentView === 'auth') {
    return (
      <AuthScreen
        allUsers={users}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('portal');
        }}
        onBackToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // 3. Admission Form Page
  if (currentView === 'admission') {
    return (
      <AdmissionForm
        branches={branches}
        onBack={() => setCurrentView('landing')}
      />
    );
  }

  // 4. Kiosk Attendance Terminal
  if (currentView === 'kiosk') {
    return (
      <KioskAttendance
        branches={branches}
        onBack={() => setCurrentView('landing')}
      />
    );
  }

  // 5. Portal View (Admin, Principal, Teacher, Student)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setCurrentView('portal');
        }}
        onLogout={handleLogout}
        onResetData={handleResetData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigateView={(v) => setCurrentView(v)}
        currentView={currentView}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'schedule' ? (
          <SharedScheduleView schedule={schedule} courses={courses} />
        ) : activeTab === 'announcements' ? (
          <SharedAnnouncements announcements={announcements} />
        ) : currentUser ? (
          <>
            {currentUser.role === 'admin' && (
              <AdminPortal users={users} courses={courses} onRefreshData={loadAllData} />
            )}

            {currentUser.role === 'principal' && (
              <PrincipalPortal
                stats={stats}
                announcements={announcements}
                users={users}
                grades={grades}
                attendance={attendance}
                onRefreshData={loadAllData}
              />
            )}

            {currentUser.role === 'teacher' && (
              <TeacherPortal
                teacherUser={currentUser}
                courses={courses}
                students={users}
                attendance={attendance}
                grades={grades}
                onRefreshData={loadAllData}
              />
            )}

            {currentUser.role === 'student' && (
              <StudentPortal
                studentUser={currentUser}
                courses={courses}
                grades={grades}
                attendance={attendance}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">Please sign in to access portal features.</p>
            <button
              onClick={() => setCurrentView('auth')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">EduPulse Institutional School OS</span>
            <span>•</span>
            <span>JWT Auth & Kiosk Attendance Engine</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentView('landing')} className="hover:text-slate-800">
              Landing
            </button>
            <button onClick={() => setCurrentView('admission')} className="hover:text-slate-800">
              Admissions
            </button>
            <button onClick={() => setCurrentView('kiosk')} className="hover:text-slate-800">
              Staff Kiosk
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
