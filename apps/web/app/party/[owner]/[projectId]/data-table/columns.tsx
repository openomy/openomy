'use client';

import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Progress } from '@openomy/ui/components/ui/progress';
import { type AntvOscpData, AntvOscpTask } from '@/types/oscp';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@openomy/ui/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@openomy/ui/components/ui/popover';
import { Button } from '@openomy/ui/components/ui/button';
import Link from 'next/link';
import { Badge } from '@openomy/ui/components/ui/badge';
import { useMemo } from 'react';
import { CheckIcon, EllipsisIcon } from 'lucide-react';

type RowData = AntvOscpData;

export function useColumns() {
  const columns: ColumnDef<RowData, RowData>[] = [
    {
      header: 'User',
      accessorKey: 'user',
      enableSorting: false,
      cell: (info) => {
        const avatar = info.row.original.avatar;
        const name = info.row.original.name;
        const index = info.row.index;
        const extraScore = info.row.original.extraScore;

        return (
          <div className="flex items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`${avatar}?s=96`} alt="avatar" />
              <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button asChild className="font-medium" variant="link">
              <Link target="_blank" href={`https://github.com/${name}`}>
                {name}
              </Link>
            </Button>
            {extraScore && typeof extraScore === 'number' && (
              <>
                {index === 0 && <span className="text-2xl">🏅</span>}
                {index === 1 && <span className="text-2xl">🥈</span>}
                {index === 2 && <span className="text-2xl">🥉</span>}
              </>
            )}
          </div>
        );
      },
    },
    {
      header: 'Progress',
      accessorKey: 'progress',
      enableSorting: false,
      cell: (info) => {
        const tasks = info.row.original.tasks || [];

        return <TaskProgress tasks={tasks} />;
      },
    },
    {
      header: () => 'Score',
      accessorKey: 'score',
      enableSorting: false,
      cell: (info) => {
        const score = info.row.original.score;
        const extraScore = info.row.original.extraScore;

        return (
          <div className="flex items-center gap-x-1.5">
            <span>{score}</span>{' '}
            {extraScore && typeof extraScore === 'number' && (
              <span className="text-green-500">(+{extraScore})</span>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
}

export function TaskProgress({ tasks }: { tasks: AntvOscpTask[] }) {
  const totalCount = tasks.length;

  const doneCount = useMemo(() => {
    return tasks.filter((item) => item.status === 'done').length;
  }, [tasks]);

  const progress = useMemo(() => {
    if (totalCount === 0) {
      return 0;
    }
    return Math.round((doneCount / totalCount) * 100);
  }, [doneCount, totalCount]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="pr-10 md:pr-20">
          <div className="flex items-center gap-x-2.5 cursor-pointer">
            <Progress
              value={progress}
              className={cn(
                'w-32 md:w-60',
                progress === 100 &&
                  "[&_[data-slot='progress-indicator']]:bg-green-500",
                progress < 100 &&
                  "[&_[data-slot='progress-indicator']]:bg-blue-500",
              )}
            />
            <div className="flex items-center gap-x-2 justify-between">
              <span>
                ({doneCount}/{totalCount})
              </span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-xs md:w-xl max-w-xl text-sm max-h-[400px] overflow-y-auto"
        align="start"
      >
        <div className="space-y-2">
          {tasks.map((item) => (
            <div key={item.issueLink} className="flex items-center gap-x-2">
              <Badge variant="secondary">{item.repo}</Badge>
              <a
                href={item.issueLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 flex-1 truncate"
              >
                {item.title}
              </a>
              <Badge
                className={cn(
                  'p-0 h-5 w-5 rounded-full',
                  item.status === 'done' &&
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                  item.status === 'processing' &&
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                )}
              >
                {item.status === 'done' && <CheckIcon className="h-4 w-4" />}
                {item.status === 'processing' && (
                  <EllipsisIcon className="h-4 w-4" />
                )}
              </Badge>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
