'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import { ScoreHint } from '@/components/repos/score-hint';

export type Contributor = {
  name?: string;
  email?: string;
  issueCount?: number;
  issueCommentCount?: number;
  pr?: number;
  prComment?: number;
  discussion?: number;
  discussionComment?: number;
  discussionAnswer?: number;
  issue?: number;
  avatar?: string;
  url?: string;
  totalScore?: number;
};

export const buildColumns = ({
  owner,
  repo,
  enableUserDetail = true,
}: {
  owner: string;
  repo: string;
  enableUserDetail?: boolean;
}) => {
  const columns: ColumnDef<Contributor, Contributor>[] = [
    {
      accessorKey: 'user',
      header: 'User',
      enableSorting: false,
      accessorFn: (row) => ({
        user: row.name,
        avatar: row.avatar,
        url: row.url,
      }),
      filterFn: (row, id, filterValue) => {
        const { user } = row.getValue(id) as { user: string };
        return user.toLowerCase().includes(filterValue.toLowerCase());
      },
      cell: (info) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { avatar, user } = info.getValue();
        return (
          <div className="flex items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`${avatar}?s=96`} alt="avatar" />
              <AvatarFallback>{user?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button asChild className="font-medium" variant="link">
              {enableUserDetail ? (
                <Link href={`/github/${owner}/${repo}/contributors/${user}`}>
                  {user}
                </Link>
              ) : (
                <a
                  className=""
                  href={`https://github.com/${user}`}
                  target="_blank"
                >
                  {user}
                </a>
              )}
            </Button>
          </div>
        );
      },
      columns: [],
    },
    {
      id: 'issues',
      header: () => <strong>Issues</strong>,
      columns: [
        {
          accessorKey: 'issue',
          header: 'Created',
        },
        {
          accessorKey: 'issueComment',
          header: 'Comments',
        },
      ],
    },
    {
      id: 'pullRequests',
      header: () => <strong>Pull Requests</strong>,
      columns: [
        {
          accessorKey: 'prMerged',
          header: 'Merged',
        },
        {
          accessorKey: 'prComment',
          header: 'Comments',
        },
      ],
    },
    {
      id: 'discussions',
      header: () => <strong>Discussions</strong>,
      columns: [
        {
          accessorKey: 'discussion',
          header: 'Created',
        },
        {
          accessorKey: 'discussionComment',
          header: 'Comments',
        },
        {
          accessorKey: 'discussionAnswer',
          // header: "Marked as answer",
          header: () => (
            <Tooltip>
              <TooltipTrigger>
                <div className="inline-flex items-center flex-nowrap">
                  <span>Answers</span>
                  <InfoIcon className="w-3.5 h-3.5 ml-1" />
                </div>
              </TooltipTrigger>
              <TooltipContent align="center" side="top">
                Marked as answer
              </TooltipContent>
            </Tooltip>
          ),
        },
      ],
    },
    {
      // header: "Score",
      accessorKey: 'totalScore',
      header: () => <ScoreHint />,
    },
  ];

  return columns;
};
