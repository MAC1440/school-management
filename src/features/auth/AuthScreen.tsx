import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { User } from '../../types';
import { useLoginMutation } from '../../store/apiSlice';
import { LoginForm } from './LoginForm';
import { QuickUserSelector } from './QuickUserSelector';

interface AuthScreenProps {
  allUsers: User[];
  onLoginSuccess: (user: User, token: string) => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ allUsers = [], onLoginSuccess, onBackToLanding }) => {
  const [loginApi] = useLoginMutation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = async (email: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginApi({ email }).unwrap();
      localStorage.setItem('edupulse_jwt', res.token);
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err?.data?.error || err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user: User) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginApi({ userId: user.id }).unwrap();
      localStorage.setItem('edupulse_jwt', res.token);
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setErrorMsg(err?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const roleBadgeStyle: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    principal: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    teacher: 'bg-primary/10 text-primary border-primary/30',
    student: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    staff: 'bg-slate-500/10 text-muted-foreground border-border',
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full mb-6">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Institutional Landing Page</span>
        </button>
      </div>

      <div className="max-w-md mx-auto w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Institutional Authentication</h1>
          <p className="text-xs text-muted-foreground">
            JWT Secured Access Control & Role Guards
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <LoginForm loading={loading} onSubmit={handleCustomLogin} />

        <QuickUserSelector
          allUsers={allUsers}
          loading={loading}
          onQuickLogin={handleQuickLogin}
          roleBadgeStyle={roleBadgeStyle}
        />
      </div>
    </div>
  );
};
