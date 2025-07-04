import { type NextRequest, NextResponse, after } from 'next/server';
import { z } from 'zod';
import { WaitlistSchema } from '@/lib/schema';
import { parseRepoPath } from '@/utils/repo';

// 自动同步 github 仓库
const autoSyncRepo = async (repoUrl: string) => {
  try {
    const { owner, repo } = parseRepoPath(repoUrl);

    const response = await fetch(
      `${process.env.API_BASE_URL}/github/sync/specificRepo/${owner}/${repo}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw Error(`Failed to send notification: ${JSON.stringify(errorData)}`);
    }
    console.log('已开启自动同步仓库：', `${owner}/${repo}`);
    return true;
  } catch (error) {
    console.log('自动同步仓库失败：', error);
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = WaitlistSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.format();
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 },
      );
    }

    const { email, repoUrl } = result.data;
    const [name] = email.split('@');

    const response = await fetch(`${process.env.API_BASE_URL}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message: repoUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to send notification', details: errorData },
        { status: 500 },
      );
    }

    after(autoSyncRepo(repoUrl));

    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.error('Error processing notification request:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.format() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
