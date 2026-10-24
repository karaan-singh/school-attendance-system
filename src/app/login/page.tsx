'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trees, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('teacher@school.edu');
  const [password, setPassword] = useState('forest2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-gradient-to-b from-sky-50 to-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-blue-100 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 ring-2 ring-blue-300">
            <Trees className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">
            Forest Ranger Sign-In
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Sylva Ancient Academy Attendance Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">
              Instructor / Teacher Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-95"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Enter Forest Portal'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 text-center text-[11px] text-slate-600">
          <span className="font-bold text-blue-900">Quick Seeded Login:</span>
          <div className="mt-1 font-mono text-[10px] text-blue-700 font-bold">
            Email: teacher@school.edu • Pass: Any
          </div>
        </div>
      </div>
    </div>
  );
}
