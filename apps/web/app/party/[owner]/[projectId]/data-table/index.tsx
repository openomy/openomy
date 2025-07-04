'use client';

import React, { useEffect, useMemo } from 'react';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import { DataTable } from '@repo/ui/components/ui/data-table';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useColumns } from './columns';

export function PartyContributorsTable({
  owner,
  projectId,
  onTotalCountChange,
}: {
  onTotalCountChange?: (totalCount: number) => void;
  owner: string;
  projectId: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'totalScore',
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

  const columns = useColumns();

  const getDataFn = async () => {
    const sortingId = sorting[0].id;
    const direction = sorting[0].desc ? 'desc' : 'asc';

    const searchParams = new URLSearchParams({
      page: `${pagination.pageIndex + 1}`,
      size: `${pagination.pageSize}`,
      sort: sortingId || 'totalScore',
      direction,
    });

    return await (
      await fetch(
        `/api/parties/${owner}/${projectId}/contributors?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    ).json();
  };

  const dataQuery = useQuery({
    queryKey: ['partyContributors', `${owner}/${projectId}`],
    queryFn: () => getDataFn(),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

  const data = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allData = (dataQuery?.data?.data ?? []) as any[];
    const page = pagination.pageIndex;
    const size = pagination.pageSize;

    const start = page * size;
    return allData.slice(start, start + size);
  }, [dataQuery?.data?.data, pagination]);

  const totalCount = dataQuery?.data?.total || 0;

  console.log('dataQuery data:', dataQuery.data);

  const table = useReactTable({
    data: data,
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
    rowCount: totalCount,
  });

  useEffect(() => {
    onTotalCountChange?.(totalCount);
  }, [totalCount, onTotalCountChange]);

  return (
    <DataTable
      table={table}
      loading={dataQuery.isFetching}
      onSort={(column) => {
        column.toggleSorting(!sorting[0].desc);
      }}
    />
  );
}
