'use client';

import type React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { TeacherSidebar } from '@/components/teacher/teacher-sidebar';
import { TeacherHeader } from '@/components/teacher/teacher-header';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'DOCENTE') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="lg:pl-64">
        <TeacherHeader />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
