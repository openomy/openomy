'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@openomy/ui/components/ui/card';
import { useMemo } from 'react';
import { CalendarDaysIcon, UsersIcon } from 'lucide-react';
import { Progress } from '@openomy/ui/components/ui/progress';
import { Badge } from '@openomy/ui/components/ui/badge';
import { dayjs } from '@/utils/dayjs';
import { cn } from '@/lib/utils';

export interface PartyData {
  id: number | string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
}

export function PartyOverview({
  data,
  className,
}: {
  data: PartyData;
  className?: string;
}) {
  const { endDate, startDate, title, description, participants } = data;

  const progress = useMemo(() => {
    const total = dayjs(endDate).diff(startDate);
    const past = dayjs(new Date()).diff(startDate);

    return Math.min(Math.round((past / total) * 100), 100);
  }, [endDate, startDate]);

  const duration = useMemo(() => {
    return `${dayjs(startDate).format('YYYY.MM.DD')} - ${dayjs(endDate).format(
      'YYYY.MM.DD',
    )}`;
  }, [endDate, startDate]);

  return (
    <Card className={cn('mb-8', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="h-4 w-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4" />
                <span>{participants} 位参与者</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="md:text-lg md:px-4 md:py-2">
            {progress === 100 ? '已结束' : '进行中'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 活动描述 */}
        <div
          className="prose prose-sm max-w-none text-muted-foreground [&_p]:mb-1.5"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* 进度展示 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">活动进度</span>
            <p className="text-xs text-muted-foreground text-right">
              已完成 {progress.toFixed(0)}%
            </p>
          </div>
          <Progress
            value={progress}
            className={cn(
              'h-3',
              progress === 100 &&
                "[&_[data-slot='progress-indicator']]:bg-green-500",
              progress < 100 &&
                "[&_[data-slot='progress-indicator']]:bg-blue-500",
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
