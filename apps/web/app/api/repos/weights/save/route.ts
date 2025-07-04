import { type NextRequest, NextResponse } from 'next/server';
import {
  SettingWeightsIssueSchema,
  SettingWeightsPrSchema,
  SettingWeightsPrIssueCommentSchema,
  SettingWeightsDiscussionSchema,
  SettingWeightsDiscussionCommentSchema,
  SettingWeightsLabelsSchema,
} from '@/lib/schema';
import { z } from 'zod';

const ReactionSchema = z.record(z.string(), z.number());

const SaveWeightsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  weights: z.object({
    issue: SettingWeightsIssueSchema.extend({
      reaction: ReactionSchema,
    }),
    pr: SettingWeightsPrSchema.extend({
      reaction: ReactionSchema,
    }),
    prIssueComment: SettingWeightsPrIssueCommentSchema.extend({
      reaction: ReactionSchema,
    }),
    discussion: SettingWeightsDiscussionSchema.extend({
      reaction: ReactionSchema,
    }),
    discussionComment: SettingWeightsDiscussionCommentSchema.extend({
      reaction: ReactionSchema,
    }),
    labels: SettingWeightsLabelsSchema,
  }),
});

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const result = SaveWeightsSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Request body invalid', errorMessage: result.error },
      { status: 400 },
    );
  }

  const { owner, repo, weights } = result.data;

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/calculate/weight/special/${owner}/${repo}`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...weights }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error?.message : 'Unknown error' },
      { status: 400 },
    );
  }
}
