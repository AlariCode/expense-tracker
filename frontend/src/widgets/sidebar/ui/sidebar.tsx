'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRightLeft,
  FolderOpen,
  LogOut,
  UserRound,
  Wallet,
} from 'lucide-react';
import type { User } from '@/entities/user';
import { getInitials } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';

const navItems = [
  { href: '/', label: 'Транзакции', icon: ArrowRightLeft },
  { href: '/categories', label: 'Категории', icon: FolderOpen },
  { href: '/profile', label: 'Профиль', icon: UserRound },
];

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col"
      style={{ background: 'var(--sidebar-bg)', color: 'var(--sidebar-fg)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: 'var(--sidebar-icon-bg)' }}
        >
          <Wallet className="h-5 w-5" style={{ color: 'var(--sidebar-fg)' }} />
        </div>
        <h1 className="text-base font-semibold tracking-tight" style={{ color: 'var(--sidebar-fg)' }}>
          Expense Tracker
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
              )}
              style={{
                background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                color: isActive ? 'var(--sidebar-fg)' : 'var(--sidebar-muted)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-fg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-muted)';
                }
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-5">
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--sidebar-icon-bg)' }}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className="text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--sidebar-fg)' }}
              >
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" style={{ color: 'var(--sidebar-fg)' }}>
                {user.name}
              </p>
              <p className="truncate text-xs" style={{ color: 'var(--sidebar-muted)' }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Выйти"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--sidebar-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-fg)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-muted)';
              }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
