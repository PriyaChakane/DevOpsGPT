import { mockDelay } from '@/lib/utils';
import { mockHistoryEntries } from '@/mocks/historyMockData';
import type { HistoryEntry, HistoryFilters } from '@/types/history';
import type { PaginatedResult } from '@/types/common';

// TODO(flask-integration): GET /history?technology=&severity=&status=&search=&page=
export async function getErrorHistory(
  filters: Partial<HistoryFilters>,
  page = 1,
  pageSize = 8
): Promise<PaginatedResult<HistoryEntry>> {
  let items = [...mockHistoryEntries];

  if (filters.technologies?.length) {
    items = items.filter((entry) => filters.technologies!.includes(entry.technology));
  }
  if (filters.severities?.length) {
    items = items.filter((entry) => filters.severities!.includes(entry.severity));
  }
  if (filters.statuses?.length) {
    items = items.filter((entry) => filters.statuses!.includes(entry.status));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((entry) => entry.error.toLowerCase().includes(q));
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return mockDelay({ items: paged, total, page, pageSize }, 500);
}
