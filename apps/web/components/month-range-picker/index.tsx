'use client';

import * as React from 'react';
import { dayjs, formatDate } from '@/utils/dayjs';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@repo/ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { MonthRangePicker as MonthRangePickerUI } from '@repo/ui/components/ui/month-range-picker';

interface DatePickerWithRangeProps {
  value?: DateRange | undefined | null;
  onSelect?: (date: DateRange | undefined) => void;
  className?: string;
}

// 不包含当前月
const MAX_DATE = dayjs().subtract(1, 'month').toDate();

export function MonthRangePicker({
  className,
  value,
  onSelect,
}: DatePickerWithRangeProps) {
  const [opened, setOpened] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<
    DateRange | undefined | null
  >(value);

  const handleClear: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    setInternalDate(undefined);
    onSelect?.(undefined);
  };

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    const newDate = {
      from: start,
      to: end,
    };
    setInternalDate(newDate);
    onSelect?.(newDate);
    setOpened(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={opened} onOpenChange={setOpened}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              'w-[205px] border border-input justify-start text-left font-normal hover:bg-transparent',
              !internalDate && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {formatDate(internalDate.from, 'YYYY-MM')} -{' '}
                  {formatDate(internalDate.to, 'YYYY-MM')}
                </>
              ) : (
                formatDate(internalDate.from, 'YYYY-MM')
              )
            ) : (
              <span>Select month range</span>
            )}
            {internalDate && (
              <span
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'w-6 h-6 rounded-full ml-auto cursor-pointer',
                )}
                onClick={handleClear}
              >
                <XIcon />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <MonthRangePickerUI
            selectedMonthRange={
              internalDate
                ? { start: internalDate.from!, end: internalDate.to! }
                : undefined
            }
            onMonthRangeSelect={handleSelect}
            minDate={new Date(2022, 0, 1)}
            maxDate={MAX_DATE}
            showQuickSelectors={true}
            callbacks={{
              yearLabel: (year) => year.toString(),
              monthLabel: (month) => month.name,
            }}
            startMenuYear={dayjs().subtract(1, 'year').toDate()}
            quickSelectors={[
              {
                label: 'Last 1 month',
                startMonth: dayjs().subtract(1, 'month').toDate(),
                endMonth: MAX_DATE,
              },
              {
                label: 'Last 3 months',
                startMonth: dayjs().subtract(3, 'month').toDate(),
                endMonth: MAX_DATE,
              },
              {
                label: 'Last 6 months',
                startMonth: dayjs().subtract(6, 'month').toDate(),
                endMonth: MAX_DATE,
              },
              {
                label: 'Last 12 months',
                startMonth: dayjs().subtract(12, 'month').toDate(),
                endMonth: MAX_DATE,
              },
            ]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
