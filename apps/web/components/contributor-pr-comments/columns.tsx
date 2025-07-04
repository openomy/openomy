'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { type ContributorPRCommentsResponseData } from '@/lib/schema';
import { formatDate } from '@/utils/dayjs';
import { Reactions } from '@/components/repos/reactions';
import { ScoreHint } from '@/components/repos/score-hint';
import { CellText } from '@/components/cell-text';

type RowData = ContributorPRCommentsResponseData['data'][number];

function PRCommentLink({
  content,
  prId,
  commentId,
}: {
  content: string;
  prId: number;
  commentId: number;
}) {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  return (
    <a
      href={`https://github.com/${owner}/${repo}/pull/${prId}#issuecomment-${commentId}`}
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
    header: 'Comment Content',
    accessorKey: 'content',
    enableSorting: false,
    cell: (info) => {
      const content = info.row.original.content;
      const prId = info.row.original.parentId;
      const commentId = info.row.original.commentId;
      return (
        <PRCommentLink content={content} prId={prId} commentId={commentId} />
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
    header: 'Reactions',
    accessorKey: 'reactions',
    enableSorting: false,
    cell: (info) => {
      const reactions = info.row.original.reactions || {};
      return <Reactions reactions={reactions} />;
    },
  },
  {
    header: () => <ScoreHint />,
    accessorKey: 'score',
    enableSorting: false,
  },
];
