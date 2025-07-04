'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import { Skeleton } from '@openomy/ui/components/ui/skeleton';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { DataTable } from '@openomy/ui/components/ui/data-table';
import { buildColumns } from './columns';
import { UserSearchInput } from '@/components/user-search-input';
import { type DateRange } from 'react-day-picker';
import { formatDate } from '@/utils/dayjs';
import { MonthRangePicker } from '@/components/month-range-picker';

export interface RepoContributorsDataTableProps {
  owner: string;
  repo: string;
  enableUserDetail?: boolean;
}

export interface RepoContributorsDataTableRef {
  reload: () => void;
}

export const RepoContributorsDataTable = forwardRef<
  RepoContributorsDataTableRef,
  RepoContributorsDataTableProps
>((props, ref) => {
  const { owner, repo, enableUserDetail } = props;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [userName, setUserName] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange | undefined | null>();

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'totalScore',
      desc: true,
    },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const getDataFn = async () => {
    const sortingId = sorting[0].id;

    return await (
      await fetch('/api/statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          size: pagination.pageSize,
          page: pagination.pageIndex + 1,
          sortBy: sortingId === 'prMerged' ? 'prMergedCount' : sortingId,
          includeUsers: userName ? [userName] : [],
          startDate: dateRange?.from
            ? formatDate(dateRange.from, 'YYYY-MM')
            : undefined,
          endDate: dateRange?.to
            ? formatDate(dateRange.to, 'YYYY-MM')
            : undefined,
        }),
      })
    ).json();
  };

  const dataQuery = useQuery({
    queryKey: [
      'data',
      owner,
      repo,
      pagination,
      // throttledFilter,
      sorting,
      userName,
      dateRange,
    ],
    queryFn: () => getDataFn(),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

  const table = useReactTable({
    data: dataQuery?.data?.data ?? [],
    columns: buildColumns({ owner, repo, enableUserDetail }),
    pageCount: Math.ceil((dataQuery?.data?.total ?? 0) / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    rowCount: dataQuery?.data?.total || 0,
  });

  const reload = () => {
    dataQuery.refetch();
  };

  useImperativeHandle(ref, () => ({
    reload: reload,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-80">
          <UserSearchInput
            owner={owner}
            repo={repo}
            onChange={(val) => {
              setPagination({
                pageIndex: 0,
                pageSize: 10,
              });
              setUserName(val);
            }}
          />
        </div>
        <MonthRangePicker
          value={dateRange}
          onSelect={(range) => {
            setPagination({
              pageIndex: 0,
              pageSize: 10,
            });
            setDateRange(range);
          }}
        />
      </div>
      <DataTable
        table={table}
        loading={dataQuery.isFetching}
        loadingRowCount={userName ? 1 : 10}
        onSort={(column) => {
          const nextSortingOrder = column.getNextSortingOrder();
          if (nextSortingOrder === 'desc' || nextSortingOrder === false) {
            column.toggleSorting(true);
          } else {
            setSorting([
              {
                id: 'totalScore',
                desc: true,
              },
            ]);
          }
        }}
        renderSkeleton={(col) => {
          if (col.id === 'user') {
            return (
              <div className="flex items-center gap-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-24" />
              </div>
            );
          }
          return <Skeleton className="h-6" />;
        }}
      />
    </div>
  );
});

RepoContributorsDataTable.displayName = 'RepoContributorsDataTable';
