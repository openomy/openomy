import { type NextRequest, NextResponse } from 'next/server';
import { ContributorDiscussionsRequestSchema } from '@/lib/schema';

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const result = ContributorDiscussionsRequestSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Request body invalid', errorMessage: result.error },
      { status: 400 },
    );
  }

  const { owner, repo, username, page, size, sort, direction } = result.data;

  try {
    const searchParams = new URLSearchParams({
      page: `${page}`,
      size: `${size}`,
      sort,
      direction,
    });

    const response = await fetch(
      `${process.env.API_BASE_URL}/repo/${owner}/${repo}/discussions/contribution/${username}?${searchParams.toString()}`,
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

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error?.message : 'Unknown error' },
      { status: 400 },
    );
  }
}
