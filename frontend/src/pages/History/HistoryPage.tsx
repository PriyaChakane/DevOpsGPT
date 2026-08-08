import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getErrorHistory } from '@/services/historyService';
import { formatDate } from '@/lib/utils';
import type { HistoryEntry } from '@/types/history';
import type { Severity, IssueStatus, Technology } from '@/types/common';

const technologyOptions: Technology[] = ['Git', 'Docker', 'Kubernetes', 'CI/CD'];
const severityOptions: Severity[] = ['critical', 'high', 'medium', 'low'];
const statusOptions: IssueStatus[] = ['resolved', 'unresolved'];

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getErrorHistory(
      {
        search,
        technologies: techFilter as Technology[],
        severities: severityFilter as Severity[],
        statuses: statusFilter as IssueStatus[],
      },
      page,
      pageSize
    ).then((result) => {
      setEntries(result.items);
      setTotal(result.total);
      setIsLoading(false);
    });
  }, [search, techFilter, severityFilter, statusFilter, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const columns: DataTableColumn<HistoryEntry>[] = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    { key: 'error', header: 'Error', render: (row) => <span className="line-clamp-1 max-w-xs text-text-primary">{row.error}</span> },
    { key: 'technology', header: 'Technology', render: (row) => row.technology },
    { key: 'severity', header: 'Severity', render: (row) => <SeverityBadge severity={row.severity} /> },
    { key: 'solution', header: 'Solution', render: (row) => <span className="line-clamp-1 max-w-xs">{row.solution}</span> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'resolutionTime', header: 'Resolution Time', render: (row) => (row.resolutionTimeMinutes > 0 ? `${row.resolutionTimeMinutes} min` : '—') },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button type="button" className="text-xs font-medium text-primary hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Error History" subtitle="Browse and filter every error DevOpsGPT has analyzed." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search errors..." className="sm:max-w-xs" />
        <FilterDropdown label="Technology" options={technologyOptions.map((t) => ({ label: t, value: t }))} selected={techFilter} onChange={(v) => { setTechFilter(v); setPage(1); }} />
        <FilterDropdown label="Severity" options={severityOptions.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} selected={severityFilter} onChange={(v) => { setSeverityFilter(v); setPage(1); }} />
        <FilterDropdown label="Status" options={statusOptions.map((s) => ({ label: s === 'resolved' ? 'Resolved' : 'Unresolved', value: s }))} selected={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} />
      </div>

      <DataTable
        columns={columns}
        data={entries}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyTitle="No history found"
        emptyDescription="Try adjusting your filters or search terms."
      />

      {!isLoading && entries.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary !px-2.5 !py-1.5" aria-label="Previous page">
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs text-text-secondary">
              Page {page} of {totalPages}
            </span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary !px-2.5 !py-1.5" aria-label="Next page">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {!isLoading && entries.length === 0 && total === 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
          <HistoryIcon size={12} />
          No history entries match the current filters.
        </p>
      )}
    </div>
  );
}
