import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bug,
  GitBranch,
  GitFork,
  Container,
  Boxes,
  Workflow,
  BookOpen,
  History,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/debugger', label: 'AI Debugger', icon: Bug },
  { to: '/git-analyzer', label: 'Git Analyzer', icon: GitBranch },
  { to: '/github-repository', label: 'GitHub Repository', icon: GitFork },
  { to: '/docker-analyzer', label: 'Docker Analyzer', icon: Container },
  { to: '/kubernetes', label: 'Kubernetes Monitor', icon: Boxes },
  { to: '/cicd', label: 'CI/CD Logs', icon: Workflow },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }: SidebarProps) {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-2.5 px-4 py-5', isCollapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
          <Sparkles size={16} />
        </div>
        {!isCollapsed && <span className="text-sm font-semibold tracking-tight text-text-primary">DevOpsGPT</span>}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="ml-auto rounded-lg p-1 text-text-muted hover:bg-bg-hover lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2.5" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary-muted text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              )
            }
          >
            <item.icon size={17} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className={cn('flex items-center gap-2.5 rounded-lg p-2', isCollapsed && 'justify-center')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-xs font-semibold text-text-primary">
            {user?.fullName?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{user?.fullName ?? 'Developer'}</p>
              <p className="truncate text-xs text-text-secondary">{user?.role ?? 'DevOps Engineer'}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={logout}
          className={cn('btn-ghost mt-1 w-full justify-start text-danger hover:bg-danger-muted hover:text-danger', isCollapsed && 'justify-center')}
        >
          <LogOut size={16} />
          {!isCollapsed && 'Log out'}
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="btn-ghost mt-1 hidden w-full justify-center lg:flex"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 border-r border-border bg-bg-surface transition-[width] duration-200 lg:block',
          isCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-72 animate-slide-in border-r border-border bg-bg-surface">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
