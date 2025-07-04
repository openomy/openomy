import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SearchParamsSchema = z.object({
  name: z.string().min(1),
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const result = SearchParamsSchema.safeParse({
      owner: searchParams.get('owner'),
      repo: searchParams.get('repo'),
      name: searchParams.get('name'),
    });

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

    const { name, owner, repo } = result.data;

    const response = await fetch(
      `${process.env.API_BASE_URL}/repo/${owner}/${repo}/contributions?nameLike=${name}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to send notification', details: errorData },
        { status: 500 },
      );
    }

    const data: string[] = await response.json();

    return NextResponse.json({ data, message: 'success' });
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
