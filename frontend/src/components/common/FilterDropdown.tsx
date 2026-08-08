import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectOption } from '@/types/common';

interface FilterDropdownProps {
  label: string;
  options: SelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  multi?: boolean;
}

export function FilterDropdown({ label, options, selected, onChange, multi = true }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleOption = (value: string) => {
    if (multi) {
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    } else {
      onChange(selected.includes(value) ? [] : [value]);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'btn-secondary text-sm',
          selected.length > 0 && '!border-primary/40 !text-primary'
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[11px]">{selected.length}</span>
        )}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-2 w-56 rounded-lg border border-border bg-bg-elevated p-1.5 shadow-card animate-fade-in"
        >
          {options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleOption(option.value)}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              >
                {option.label}
                {isSelected && <Check size={14} className="text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
