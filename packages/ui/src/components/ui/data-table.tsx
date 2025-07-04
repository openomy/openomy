'use client';

import React, { type ReactNode } from 'react';
import {
  flexRender,
  Table as TanstackTable,
  type Column,
} from '@tanstack/react-table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@repo/ui/components/ui/pagination';
import { Button } from '@repo/ui/components/ui/button';
import {
  ArrowDown10,
  ArrowDownAZ,
  ArrowUp01,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/ui/table';
import { cn } from '@repo/ui/lib/utils';

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

export interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const totalPageCount = table.getPageCount();
  const page = table.getState().pagination.pageIndex + 1;

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <Button
              className={cn('h-8 w-8')}
              variant={page === i ? 'outline' : 'ghost'}
              onClick={() => table.setPageIndex(i - 1)}
            >
              {i}
            </Button>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <Button
            className={cn('h-8 w-8')}
            variant={page === 1 ? 'outline' : 'ghost'}
            onClick={() => table.setPageIndex(0)}
          >
            1
          </Button>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <Button
              className={cn('h-8 w-8')}
              variant={page === i ? 'outline' : 'ghost'}
              onClick={() => table.setPageIndex(i - 1)}
            >
              {i}
            </Button>
          </PaginationItem>,
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <Button
            className={cn('h-8 w-8')}
            variant={page === totalPageCount ? 'outline' : 'ghost'}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            {totalPageCount}
          </Button>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      <div className="hidden md:flex items-center whitespace-nowrap text-sm text-[rgba(255,255,255,0.37)]">
        Total {table.getRowCount()} items
      </div>
      <Pagination className="md:justify-end">
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <Button
              variant="ghost"
              className="h-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </Button>
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <Button
              variant="ghost"
              className="h-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
