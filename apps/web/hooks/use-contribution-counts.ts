'use client';

import { useQuery } from '@tanstack/react-query';
import { type UserContributionResponseData } from '@/lib/schema';

export function useContributionCounts({
  owner,
  repo,
  contributorName,
}: {
  owner: string;
  repo: string;
  contributorName: string;
}) {
  const getDataFn = async (): Promise<UserContributionResponseData> => {
    const response = await fetch(
      `/api/repos/contributions/${contributorName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          username: contributorName,
        }),
      },
    );

    const data = (await response.json()) as {
      data: UserContributionResponseData;
    };

    return data.data;
  };

  const { data } = useQuery({
    queryKey: ['contributorProfile', owner, repo, contributorName],
    queryFn: () => getDataFn(),
  });

  return data;
}
