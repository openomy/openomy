'use client';

import React from 'react';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import { DataTable } from '@openomy/ui/components/ui/data-table';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { columns } from './columns';

export function ContributorDiscussionCommentsTable({
  owner,
  repo,
  username,
}: {
  owner: string;
  repo: string;
  username: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const getDataFn = async () => {
    const sortingId = sorting[0].id;
    const direction = sorting[0].desc ? 'desc' : 'asc';
    return await (
      await fetch('/api/repos/discussions/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          username,
          size: pagination.pageSize,
          page: pagination.pageIndex + 1,
          sort: sortingId,
          direction,
        }),
      })
    ).json();
  };

  const dataQuery = useQuery({
    queryKey: [
      'repoDiscussionsComments',
      owner,
      repo,
      username,
      pagination,
      // throttledFilter,
      sorting,
    ],
    queryFn: () => getDataFn(),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

  const table = useReactTable({
    data: dataQuery?.data?.data ?? [],
    columns,
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

  return (
    <div>
      <DataTable
        table={table}
        loading={dataQuery.isFetching}
        onSort={(column) => {
          column.toggleSorting(!sorting[0].desc);
        }}
      />
    </div>
  );
}
