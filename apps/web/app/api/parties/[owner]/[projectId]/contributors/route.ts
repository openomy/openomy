import { NextResponse, type NextRequest } from 'next/server';
import { getOscpData } from '@/services/antvis';
import { z } from 'zod';

const SearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(10),
  sort: z.enum(['totalScore']).optional().default('totalScore'),
  direction: z.enum(['desc', 'asc']).optional().default('desc'),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ owner: string; projectId: string }> },
) {
  try {
    const { owner, projectId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const result = SearchParamsSchema.safeParse({
      page: searchParams.get('page'),
      size: searchParams.get('size'),
      sort: searchParams.get('sort'),
      direction: searchParams.get('direction'),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const { page, size, sort, direction } = result.data;

    console.log('searchParams', projectId, owner, page, size, sort, direction);

    const data = await getOscpData();

    return NextResponse.json({
      data: data,
      total: data.length,
      message: 'success',
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Fetach failed: ${error?.toString()}` },
      { status: 500 },
    );
  }
}
