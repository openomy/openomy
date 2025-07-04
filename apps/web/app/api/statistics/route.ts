import { StatisticsRequestSchema } from '@/lib/schema';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/statistics
export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const result = StatisticsRequestSchema.safeParse(requestBody);

  if (result.error) {
    return NextResponse.json(
      { error: 'Request body invalid', errorMessage: result.error },
      { status: 400 },
    );
  }

  const {
    owner,
    repo,
    size,
    page,
    sortBy = 'pr',
    excludeUsers,
    includeUsers,
    startDate,
    endDate,
  } = result.data;

  try {
    // await calculateCache({ owner, repo });

    // Construct the API URL
    // Construct the URL with the necessary query parameters
    const url = new URL(
      `${process.env.API_BASE_URL}/github/statistics/${owner}/${repo}`,
    );

    const filterUsers: string[] = [];
    // 特殊处理 lobe
    if (excludeUsers.length === 0 && owner === 'lobehub') {
      excludeUsers.push('^(?!lobehubbot$).*$');
    }

    filterUsers.push(...excludeUsers);
    filterUsers.push(...includeUsers);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page,
        size,
        sortBy,
        filterUsers,
        startDate,
        endDate,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const responseData = await response.json();
    const { data, total } = responseData;

    // Assuming the API returns an array of members with similar structure
    const membersWithCounts = data?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (member: any) => {
        return {
          avatar: `https://avatars.githubusercontent.com/${member?.username}`,
          name: member?.username,
          issue: member?.issueCount || 0,
          pr: member?.prCount || 0,
          prComment: member?.prCommentCount || 0,
          prMerged: member?.prMergedCount || 0,
          issueComment: member?.issueCommentCount || 0,
          discussion: member?.discussionCount || 0,
          discussionComment: member?.discussionCommentCount || 0,
          discussionAnswer: member?.discussionAnsweredCount || 0,
          totalScore: Number(((member?.totalScore || 0) as number).toFixed(1)),
        };
      },
    );

    return NextResponse.json({
      data: membersWithCounts,
      total: total,
      page,
      size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch members', errorMessage: error?.toString() },
      { status: 500 },
    );
  }
}
