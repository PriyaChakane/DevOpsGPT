import { Menu, Bell, HelpCircle } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="rounded-lg p-2 text-text-secondary hover:bg-bg-hover lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden max-w-md flex-1 sm:block">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search errors, solutions, repositories..."
          ariaLabel="Search errors, solutions, repositories"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          title="Help & documentation"
          aria-label="Help and documentation"
          className="rounded-lg p-2 text-text-secondary hover:bg-bg-hover hover:text-text-primary"
        >
          <HelpCircle size={19} />
        </button>
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-text-secondary hover:bg-bg-hover hover:text-text-primary"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
        <div className="ml-1 flex items-center gap-2.5 border-l border-border pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-white">
            {user?.fullName?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight text-text-primary">{user?.fullName ?? 'Developer'}</p>
            <p className="text-xs leading-tight text-text-secondary">{user?.role ?? 'DevOps Engineer'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
