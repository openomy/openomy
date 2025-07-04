import { z } from "zod";

export const RepoSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const SettingWeightsReactionSchema = z.object({
  positive: z.number(),
  negative: z.number(),
  neutral: z.number(),
  // thumbsUp: z.number(),
  // thumbsDown: z.number(),
  // laugh: z.number(),
  // hooray: z.number(),
  // heart: z.number(),
  // eyes: z.number(),
  // rocket: z.number(),
  // confused: z.number(),
});

export type SettingWeightsReaction = z.infer<
  typeof SettingWeightsReactionSchema
>;

export const SettingWeightsIssueSchema = z.object({
  base: z.number(),
  comments: z.number(),
  status: z.object({
    open: z.number(),
    closed: z.number(),
  }),
  reaction: SettingWeightsReactionSchema,
});

export const SettingWeightsPrSchema = z.object({
  base: z.number(),
  commentsCount: z.number(),
  status: z.object({
    open: z.number(),
    closed: z.number(),
    merged: z.number(),
  }),
  linkedIssuesCount: z.number(),
  reaction: SettingWeightsReactionSchema,
  filesChanged: z.number(),
});

export const SettingWeightsPrIssueCommentSchema = z.object({
  base: z.number(),
  reaction: SettingWeightsReactionSchema,
});

export const SettingWeightsDiscussionSchema = z.object({
  base: z.number(),
  comments: z.number(),
  upvotesCount: z.number(),
  reaction: SettingWeightsReactionSchema,
});

export const SettingWeightsDiscussionCommentSchema = z.object({
  base: z.number(),
  upvotesCount: z.number(),
  isAnswered: z.number(),
  reaction: SettingWeightsReactionSchema,
});

export const SettingWeightsLabelsSchema = z.record(z.string(), z.number());

export const SettingWeightsSchema = z.object({
  issue: SettingWeightsIssueSchema,
  pr: SettingWeightsPrSchema,
  prIssueComment: SettingWeightsPrIssueCommentSchema,
  discussion: SettingWeightsDiscussionSchema,
  discussionComment: SettingWeightsDiscussionCommentSchema,
  labels: SettingWeightsLabelsSchema,
});

export type SettingWeights = z.infer<typeof SettingWeightsSchema>;

export const StatisticsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  size: z.number().int().positive(),
  page: z.number().int().positive(),
  sortBy: z
    .enum([
      "pr",
      "prComment",
      "prMergedCount",
      "issue",
      "issueComment",
      "discussion",
      "discussionComment",
      "discussionAnswer",
      "totalScore",
    ])
    .optional(),
  excludeUsers: z.array(z.string()).default([]),
  includeUsers: z.array(z.string()).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type StatisticsRequest = z.infer<typeof StatisticsRequestSchema>;

export const ContributorRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
});

export type ContributorRequest = z.infer<typeof ContributorRequestSchema>;

export const UserContributionResponseDataSchema = z.object({
  issue: z.object({
    createdCount: z.number(),
    commentCount: z.number(),
  }),
  pr: z.object({
    createdCount: z.number(),
    mergedCount: z.number(),
    commentCount: z.number(),
  }),
  discussion: z.object({
    createdCount: z.number(),
    commentCount: z.number(),
    markedAsAnsweredCount: z.number(),
  }),
  score: z.number(),
});

export type UserContributionResponseData = z.infer<
  typeof UserContributionResponseDataSchema
>;

export const ContributorIssuesRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
  page: z.coerce.number().optional().default(0),
  size: z.coerce.number().optional().default(10),
  sort: z
    .enum(["createdAt", "closedAt", "comments", "score"])
    .optional()
    .default("createdAt"),
  direction: z.enum(["desc", "asc"]).optional().default("desc"),
});

export type ContributorIssuesRequest = z.infer<
  typeof ContributorIssuesRequestSchema
>;

export const ContributorIssuesResponseDataSchema = z.object({
  total: z.number().positive(),
  data: z.array(
    z.object({
      title: z.string(),
      status: z.string(),
      createdAt: z.string(),
      closedAt: z.string().optional(),
      labels: z.array(z.string()),
      reactions: z.record(z.string(), z.number()),
      comments: z.number(),
      score: z.number(),
      issueId: z.number(),
    })
  ),
});

export type ContributorIssuesResponseData = z.infer<
  typeof ContributorIssuesResponseDataSchema
>;

export const ContributorDiscussionsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
  page: z.coerce.number().optional().default(0),
  size: z.coerce.number().optional().default(10),
  sort: z
    .enum(["createdAt", "upvotes", "comments"])
    .optional()
    .default("createdAt"),
  direction: z.enum(["desc", "asc"]).optional().default("desc"),
});

export const ContributorDiscussionsResponseDataSchema = z.object({
  total: z.number().positive(),
  data: z.array(
    z.object({
      title: z.string(),
      createdAt: z.string(),
      upvotes: z.number(),
      comments: z.number(),
      labels: z.array(z.string()),
      reactions: z.record(z.string(), z.number()),
      score: z.number(),
      discussionId: z.number(),
    })
  ),
});

export type ContributorDiscussionsResponseData = z.infer<
  typeof ContributorDiscussionsResponseDataSchema
>;

export const ContributorIssueCommentsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
  page: z.coerce.number().optional().default(0),
  size: z.coerce.number().optional().default(10),
  sort: z.enum(["createdAt", "scores"]).optional().default("createdAt"),
  direction: z.enum(["desc", "asc"]).optional().default("desc"),
});

export const ContributorIssueCommentsResponseDataSchema = z.object({
  total: z.number().positive(),
  data: z.array(
    z.object({
      parentId: z.number(),
      commentId: z.number(),
      content: z.string(),
      createdAt: z.string(),
      reactions: z.record(z.string(), z.number()),
      score: z.number(),
      type: z.enum(["ISSUE", "PR"]),
    })
  ),
});

export type ContributorIssueCommentsResponseData = z.infer<
  typeof ContributorIssueCommentsResponseDataSchema
>;

export const ContributorPRCommentsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
  page: z.coerce.number().optional().default(0),
  size: z.coerce.number().optional().default(10),
  sort: z.enum(["createdAt", "scores"]).optional().default("createdAt"),
  direction: z.enum(["desc", "asc"]).optional().default("desc"),
});

export const ContributorPRCommentsResponseDataSchema = z.object({
  total: z.number().positive(),
  data: z.array(
    z.object({
      parentId: z.number(),
      commentId: z.number(),
      content: z.string(),
      createdAt: z.string(),
      reactions: z.record(z.string(), z.number()),
      score: z.number(),
      type: z.enum(["ISSUE", "PR"]),
    })
  ),
});

export type ContributorPRCommentsResponseData = z.infer<
  typeof ContributorPRCommentsResponseDataSchema
>;

export const ContributorDiscussionCommentsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
  page: z.coerce.number().optional().default(0),
  size: z.coerce.number().optional().default(10),
  sort: z
    .enum(["createdAt", "referencedCount", "score"])
    .optional()
    .default("createdAt"),
  direction: z.enum(["desc", "asc"]).optional().default("desc"),
});

export const ContributorDiscussionCommentsResponseDataSchema = z.object({
  total: z.number().positive(),
  data: z.array(
    z.object({
      parentId: z.number(),
      commentId: z.number(),
      content: z.string(),
      markedAsAnswered: z.boolean(),
      createdAt: z.string(),
      reactions: z.record(z.string(), z.number()),
      referencedCount: z.number(),
      score: z.number(),
    })
  ),
});

export type ContributorDiscussionCommentsResponseData = z.infer<
  typeof ContributorDiscussionCommentsResponseDataSchema
>;

export const ContributorPrsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  username: z.string().min(1),
  page: z.coerce.number().optional().default(0),
  size: z.coerce.number().optional().default(10),
  sort: z
    .enum([
      "createdAt",
      "comments",
      "linkIssueNumber",
      "additions",
      "deletions",
    ])
    .optional()
    .default("createdAt"),
  direction: z.enum(["desc", "asc"]).optional().default("desc"),
});

export const ContributorPrsResponseDataSchema = z.object({
  total: z.number().positive(),
  data: z.array(
    z.object({
      title: z.string(),
      username: z.string(),
      createdAt: z.string(),
      closedAt: z.string(),
      number: z.number(),
      type: z.enum([
        "PULL_REQUEST",
        "MERGED_PULL_REQUEST",
        "CLOSED_PULL_REQUEST",
        "DRAFT_PULL_REQUEST",
      ]),
      commits: z.array(z.string()),
      comments: z.number(),
      labels: z.array(z.string()),
      reactions: z.record(z.string(), z.number()),
      linkIssueNumber: z.number(),
      additions: z.number(),
      deletions: z.number(),
      prId: z.number(),
    })
  ),
});

export type ContributorPrsResponseData = z.infer<
  typeof ContributorPrsResponseDataSchema
>;

export const WeightLabelsRequestSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const WaitlistSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  repoUrl: z.string().refine((val) => {
    if (!val) {
      return false;
    }

    if (!val.startsWith("https://github.com")) {
      return false;
    }

    const url = new URL(val, "https://github.com");
    const pathSegments = url.pathname.split("/").filter(Boolean);
    if (pathSegments.length !== 2) {
      return false;
    }
    const owner = pathSegments[0];
    const repo = pathSegments[1];

    if (owner && repo) {
      return true;
    } else {
      return false;
    }
  }, "Please enter a valid Github repository URL"),
});
