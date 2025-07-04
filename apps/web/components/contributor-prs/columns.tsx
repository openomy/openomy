'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type ContributorPrsResponseData } from '@/lib/schema';
import { useParams } from 'next/navigation';
// import { cn } from "@/lib/utils";
import { formatDate } from '@/utils/dayjs';
import { Labels } from '@/components/repos/labels';
import { Reactions } from '@/components/repos/reactions';
import { CellText } from '@/components/cell-text';
import { ScoreHint } from '@/components/repos/score-hint';
import { PRCloseIcon } from '@/components/icons/pr-close';
import { PROpenIcon } from '@/components/icons/pr-open';

type RowData = ContributorPrsResponseData['data'][number];

// const prStutasMap: Record<RowData["type"], string> = {
//   PULL_REQUEST: "Open",
//   CLOSED_PULL_REQUEST: "Close",
//   DRAFT_PULL_REQUEST: "Draft",
//   MERGED_PULL_REQUEST: "Merged",
// };

function PRLink({ content, prId }: { content: string; prId: number }) {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  return (
    <a
      href={`https://github.com/${owner}/${repo}/pull/${prId}`}
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
    header: 'PR Title',
    accessorKey: 'title',
    enableSorting: false,
    cell: (info) => {
      const title = info.row.original.title;
      const prId = info.row.original.prId;
      const type = info.row.original.type;
      return (
        <div className="flex items-center gap-x-4">
          {type === 'PULL_REQUEST' ? (
            <PROpenIcon className="text-[#54FF54]" />
          ) : (
            <PRCloseIcon className="text-[#3a3a3a]" />
          )}
          <PRLink content={title} prId={prId} />
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
    header: 'Linked Issues',
    accessorKey: 'linkIssueNumber',
  },
  {
    header: 'Files Changed(+/-)',
    accessorKey: 'filesChanged',
    enableSorting: false,
    cell: (info) => {
      const additions = info.row.original.additions;
      const deletions = info.row.original.deletions;
      return (
        <div className="flex items-center">
          <span className="text-green-500">{`+${additions}`}</span>
          <span>/</span>
          <span className="text-red-500">{`-${deletions}`}</span>
        </div>
      );
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
