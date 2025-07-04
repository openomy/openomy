'use client';

import React from 'react';
import {
  flexRender,
  Table as TanstackTable,
  type Column,
} from '@tanstack/react-table';
import { DataTablePagination } from './pagination';
import { ArrowDown10, ArrowDownAZ, ArrowUp01 } from 'lucide-react';
import { Skeleton } from '@openomy/ui/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@openomy/ui/components/ui/table';

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  loading?: boolean;
  onSort?: (column: Column<TData>) => void;
  loadingRowCount?: number;
  skeletonHeight?: number;
  // renderColumnFilter?: (column: Column<TData>) => React.ReactNode;
  renderSkeleton?: (
    column: Column<TData>,
    cellIndex: number,
  ) => React.ReactNode;
}

export function DataTable<TData>({
  table,
  loading,
  onSort,
  loadingRowCount = 10,
  skeletonHeight = 24,
  renderSkeleton,
}: DataTableProps<TData>) {
  // 创建加载时的行数组
  const loadingRows = Array.from({ length: loadingRowCount }, (_, index) => (
    <TableRow key={`loading-${index}`}>
      {table.getVisibleLeafColumns().map((col, cellIndex) => (
        <TableCell key={`loading-cell-${cellIndex}`} className="px-2">
          {typeof renderSkeleton === 'function' ? (
            renderSkeleton(col, cellIndex)
          ) : (
            <Skeleton className="" style={{ height: skeletonHeight }} />
          )}
        </TableCell>
      ))}
    </TableRow>
  ));

  // 自定义排序图标
  const getSortIcon = (isSorted: string | false, headerName?: string) => {
    const className = `${
      isSorted !== false ? 'text-blue-500' : 'font-bold'
    } size-4 self-center`;
    if (headerName === 'user') {
      return <ArrowDownAZ className={className} />;
    }
    return isSorted === 'desc' || isSorted === false ? (
      <ArrowDown10 className={className} />
    ) : (
      <ArrowUp01 className={className} />
    );
  };

  const handleSort = (column: Column<TData>) => {
    if (column.getCanSort()) {
      if (onSort) {
        onSort(column);
      }
    }
  };

  return (
    <div>
      <div className="rounded-[16px] border">
        <Table style={{ minWidth: '600px' }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-2 first:px-4 dark:text-[rgba(255,255,255,0.67)] font-normal"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        } flex gap-2`}
                        onClick={() => handleSort(header.column)}
                        title={
                          header.column.getCanSort()
                            ? 'Click to sort (desc only)'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() ? (
                          getSortIcon(
                            header.column.getIsSorted(),
                            header?.getContext().header?.id,
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              loadingRows
            ) : table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 first:px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center px-2"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between py-6">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
