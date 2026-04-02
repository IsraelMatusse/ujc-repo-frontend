'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  FileText,
  CheckSquare,
  BookOpen,
  User,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navItems = [
  {
    title: 'Dashboard',
    href: '/teacher',
    icon: LayoutDashboard,
  },
  {
    title: 'Meus Materiais',
    href: '/teacher/materials',
    icon: FileText,
  },
  {
    title: 'Submeter Material',
    href: '/teacher/upload',
    icon: Upload,
  },
  {
    title: 'Para Avaliar',
    href: '/teacher/review',
    icon: CheckSquare,
    badge: 'pendente',
  },
  {
    title: 'Disciplinas',
    href: '/teacher/subjects',
    icon: BookOpen,
  },
  {
    title: 'Perfil',
    href: '/teacher/profile',
    icon: User,
  },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <img
                src="/ujc-logo.png"
                alt="UJC"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                Repositório UJC
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Área do Docente
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map(item => {
              const isActive =
                item.href === '/teacher' ? pathname === '/teacher' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-1.5 py-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer hint */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Área exclusiva para docentes da UJC
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
