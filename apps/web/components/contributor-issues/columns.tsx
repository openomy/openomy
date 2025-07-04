'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type ContributorIssuesResponseData } from '@/lib/schema';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/dayjs';
import { Labels } from '@/components/repos/labels';
import { Reactions } from '@/components/repos/reactions';
import { CellText } from '@/components/cell-text';
import { ScoreHint } from '@/components/repos/score-hint';
import { IssueStatusIcon } from '@/components/icons/issue-status';

export type RowData = ContributorIssuesResponseData['data'][number];

function IssueLink({ content, issueId }: { content: string; issueId: number }) {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  return (
    <a
      href={`https://github.com/${owner}/${repo}/issues/${issueId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4"
    >
      <CellText text={content} />
    </a>
  );
}

export const columns: ColumnDef<RowData, RowData>[] = [
  {
    header: 'Issues Title',
    accessorKey: 'title',
    enableSorting: false,
    cell: (info) => {
      const title = info.row.original.title;
      const issueId = info.row.original.issueId;
      const status = info.row.original.status;
      return (
        <div className="flex items-center gap-x-4">
          <IssueStatusIcon
            className={cn(
              'text-[#3a3a3a]',
              status === 'OPEN' && 'text-[#54FF54]',
            )}
          />
          <IssueLink content={title} issueId={issueId} />
        </div>
      );
    },
  },
  {
    header: 'Created Time',
    accessorKey: 'createdAt',
    cell: (info) => {
      const createdAt = info.row.original.createdAt;
      return formatDate(createdAt);
    },
  },
  {
    header: 'Labels',
    accessorKey: 'labels',
    enableSorting: false,
    cell: (info) => {
      const labels = info.row.original.labels || [];
      return <Labels labels={labels} />;
    },
  },
  {
    header: 'Reactions',
    accessorKey: 'reactions',
    enableSorting: false,
    cell: (info) => {
      const reactions = info.row.original.reactions || {};
      return <Reactions reactions={reactions} />;
    },
  },
  {
    header: 'Comments',
    accessorKey: 'comments',
  },
  {
    header: () => <ScoreHint />,
    accessorKey: 'score',
    enableSorting: false,
  },
];
