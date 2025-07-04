'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@openomy/ui/components/ui/avatar';
import { useGithubUser } from '@/hooks/use-github-user';
import { formatNumber } from '@/lib/utils';
import { UsersIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { type UserContributionResponseData } from '@/lib/schema';
import { PRIcon } from '@/components/icons/pr';
import { IssueIcon } from '@/components/icons/issue';
import { DiscussionIcon } from '@/components/icons/discussion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@openomy/ui/components/ui/skeleton';

export function ContributorProfile({
  owner,
  repo,
  username,
  className,
}: {
  owner: string;
  repo: string;
  username: string;
  className?: string;
}) {
  const githubUserDataQuery = useGithubUser(username);
  const githubUserData = githubUserDataQuery.data;

  const getDataFn = async (): Promise<UserContributionResponseData> => {
    const response = await fetch(`/api/repos/contributions/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner,
        repo,
        username,
      }),
    });

    const data = (await response.json()) as {
      data: UserContributionResponseData;
    };

    return data.data;
  };

  const { data, isLoading: overviewLoading } = useQuery({
    queryKey: ['contributorProfile', owner, repo, username],
    queryFn: () => getDataFn(),
  });

  const overviewData = [
    {
      title: 'Issue',
      icon: <IssueIcon className="w-8 h-8" />,
      items: [
        { label: 'Created', value: data?.issue.createdCount || 0 },
        { label: 'Comments', value: data?.issue.commentCount || 0 },
      ],
    },
    {
      title: 'PR',
      icon: <PRIcon className="w-8 h-8" />,
      items: [
        { label: 'Created', value: data?.pr.createdCount || 0 },
        { label: 'Merged', value: data?.pr.mergedCount || 0 },
        { label: 'Comments', value: data?.pr.commentCount || 0 },
      ],
    },
    {
      title: 'Discussion',
      icon: <DiscussionIcon className="w-8 h-8" />,
      items: [
        { label: 'Created', value: data?.discussion.createdCount || 0 },
        { label: 'Comments', value: data?.discussion.commentCount || 0 },
        {
          label: 'Marked as Answer',
          value: data?.discussion.markedAsAnsweredCount || 0,
        },
      ],
    },
  ];

  if (githubUserDataQuery.isLoading || overviewLoading) {
    return (
      <div className={cn('py-4', className)}>
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border dark:border-[rgba(255,255,255, 0.1)]">
            <div className="flex items-center gap-x-6">
              <Skeleton className="rounded-full w-30 h-30" />
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <Skeleton className="w-30 h-[20px]" />
                  <Skeleton className="w-20 h-[18px]" />
                </div>
                <div className="flex items-center gap-x-2.5 text-muted-foreground text-sm">
                  <Skeleton className="w-48 h-[20px]" />
                </div>
              </div>
              <div className="ml-auto mb-auto md:mb-0 space-y-1">
                <Skeleton className="w-40 h-[24px]" />
                <Skeleton className="w-40 h-[44px]" />
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-5 rounded-2xl border dark:border-[rgba(255,255,255, 0.1)]">
            {overviewData.map((item) => (
              <div key={item.title} className="flex items-center gap-x-4">
                <div className="p-2.5 hidden md:block">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-30 h-[24px]" />
                  <div className="flex items-center gap-x-4 dark:text-[#7a7a7a] font-[300] text-[16px] leading-5">
                    {item.items.map((subItem) => (
                      <Skeleton key={subItem.label} className="w-24 h-[20px]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-4', className)}>
      <div className="space-y-4">
        <div className="p-6 rounded-2xl border dark:border-[rgba(255,255,255, 0.1)]">
          <div className="flex items-center gap-x-6">
            <Avatar className="w-30 h-30 hidden md:block border dark:border-[rgba(255,255,255, 0.06)]">
              <AvatarImage
                src={`https://avatars.githubusercontent.com/${username}?s=256`}
                alt={username}
              />
              <AvatarFallback className="w-30 h-30">{username}</AvatarFallback>
            </Avatar>
            <div className="space-y-4">
              <div>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <div className="text-xl leading-5 font-semibold">
                    {githubUserData?.name || username}
                  </div>
                </a>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <div className="text-base leading-5 text-muted-foreground">
                    {username}
                  </div>
                </a>
              </div>
              <div className="flex items-center gap-x-2.5 text-muted-foreground text-sm">
                <div className="flex items-center gap-x-2.5">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  <div className="flex items-center gap-x-0.5">
                    <span className="text-primary font-semibold">
                      {formatNumber(githubUserData?.followers || 0, 0)}
                    </span>
                    <span>followers</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-0.5">
                  <span className="text-primary font-semibold">
                    {formatNumber(githubUserData?.following || 0, 0)}
                  </span>
                  <span>following</span>
                </div>
              </div>
            </div>
            <div className="ml-auto mb-auto md:mb-0">
              <div className="hidden md:block">Contribution Scores</div>
              <div className="text-[20px] leading-6 md:text-[40px] md:leading-12 dark:text-[#ff0] font-semibold">
                {data?.score.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5 rounded-2xl border dark:border-[rgba(255,255,255, 0.1)]">
          {overviewData.map((item) => (
            <div key={item.title} className="flex items-center gap-x-4">
              <div className="p-2.5 hidden md:block">{item.icon}</div>
              <div className="space-y-1">
                <div className="text-[20px] leading-6 font-medium">
                  {item.title}
                </div>
                <div className="flex items-center gap-x-4 dark:text-[#7a7a7a] font-[300] text-[16px] leading-5">
                  {item.items.map((subItem) => (
                    <span key={subItem.label} className="text-xs md:text-base">
                      {subItem.label}: {subItem.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
