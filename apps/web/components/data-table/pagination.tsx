'use client';

import { Table } from '@tanstack/react-table';
import { type ReactNode } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@repo/ui/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { cn } from '@/lib/utils';

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
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
