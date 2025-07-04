'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type ContributorIssueCommentsResponseData } from '@/lib/schema';
import { useParams } from 'next/navigation';
import { formatDate } from '@/utils/dayjs';
import { Reactions } from '@/components/repos/reactions';
import { ScoreHint } from '@/components/repos/score-hint';
import { CellText } from '@/components/cell-text';

type RowData = ContributorIssueCommentsResponseData['data'][number];

function IssueCommentLink({
  content,
  issueId,
  commentId,
}: {
  content: string;
  issueId: number;
  commentId: number;
}) {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  return (
    <a
      href={`https://github.com/${owner}/${repo}/issues/${issueId}#issuecomment-${commentId}`}
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
      const issueId = info.row.original.parentId;
      const commentId = info.row.original.commentId;
      return (
        <IssueCommentLink
          content={content}
          issueId={issueId}
          commentId={commentId}
        />
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
