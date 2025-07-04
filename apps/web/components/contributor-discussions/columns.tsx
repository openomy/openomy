'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type ContributorDiscussionsResponseData } from '@/lib/schema';
import { formatDate } from '@/utils/dayjs';
import { useParams } from 'next/navigation';
import { Labels } from '@/components/repos/labels';
import { Reactions } from '@/components/repos/reactions';
import { CellText } from '@/components/cell-text';
import { ScoreHint } from '@/components/repos/score-hint';

type RowData = ContributorDiscussionsResponseData['data'][number];

function DiscussionLink({
  content,
  discussionId,
}: {
  content: string;
  discussionId: number;
}) {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  return (
    <a
      href={`https://github.com/${owner}/${repo}/discussions/${discussionId}`}
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
      const discussionId = info.row.original.discussionId;
      return <DiscussionLink content={title} discussionId={discussionId} />;
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
    header: 'Upvotes',
    accessorKey: 'upvotes',
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
    header: 'Labels',
    accessorKey: 'labels',
    enableSorting: false,
    cell: (info) => {
      const labels = info.row.original.labels || [];
      return <Labels labels={labels} />;
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
