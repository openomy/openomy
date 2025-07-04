import { type NextRequest, NextResponse } from 'next/server';
import {
  ContributorRequestSchema,
  type UserContributionResponseData,
} from '@/lib/schema';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const result = ContributorRequestSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Request body invalid', errorMessage: result.error },
      { status: 400 },
    );
  }

  const { owner, repo, username } = result.data;

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/repo/${owner}/${repo}/contribution/${username}`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    const responseData: UserContributionResponseData = {
      issue: {
        createdCount: data.createdIssues,
        commentCount: data.issueComments,
      },
      pr: {
        createdCount: data.createdPRs,
        mergedCount: data.mergedPRs,
        commentCount: data.prComments,
      },
      discussion: {
        createdCount: data.createdDiscussions,
        commentCount: data.discussionComments,
        markedAsAnsweredCount: data.markedAsAnswered,
      },
      score: Number((data.score || 0).toFixed(1)),
    };

    return NextResponse.json(
      {
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error?.message : 'Unknown error' },
      { status: 400 },
    );
  }
}
