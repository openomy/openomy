import * as d3 from 'd3';
import pLimit from 'p-limit';
import opentypejs from 'opentype.js';
import { dayjs } from '@/utils/dayjs';
import { parseHTML } from 'linkedom';

export type ChartType = 'list' | 'histogram' | 'podium' | 'bubble';

export const allBubbleLegends = ['pr', 'issue', 'discussion'] as const;

export type BubbleLegendType = (typeof allBubbleLegends)[number];

export function createSVGContext() {
  const { document } = parseHTML('<!DOCTYPE html><html><body></body></html>');

  // Define an SVG container
  const body = document.querySelector('body')!;
  const container = document.createElement('div');
  body.appendChild(container);

  return { document, container };
}

export const parseSearchParams = (searchParams: URLSearchParams) => {
  const repo = searchParams.get('repo') || 'lobehub/lobe-chat';
  // 图表类型
  const chart = (searchParams.get('chart') || 'list') as ChartType;
  const exclude = [
    ...new Set(
      new Set(
        searchParams
          .getAll('exclude')
          .map((item) => item.split(','))
          .flat(),
      ),
    ),
  ];
  const latestMonthParam = searchParams.get('latestMonth');
  // 若为 1，则重新缓存
  const recache = searchParams.get('recache');

  // 解析 bubble 图例参数
  const legend = [
    ...new Set(
      searchParams
        .getAll('legend')
        .map((item) => item.split(','))
        .flat(),
    ),
  ].filter((item) =>
    allBubbleLegends.includes(item as BubbleLegendType),
  ) as BubbleLegendType[];

  // 按照 pr、issue、discussion 的重要顺序排序
  legend.sort((a, b) => {
    const priorityA = allBubbleLegends.indexOf(a);
    const priorityB = allBubbleLegends.indexOf(b);
    return priorityA - priorityB;
  });

  // 特殊处理 lobe 仓库
  if (repo === 'lobehub/lobe-chat' && exclude.length === 0) {
    exclude.push(...['^(?!arvinxx$).*$', '^(?!canisminor1990$).*$']);
  }
  // // 特殊处理 ant-design 仓库
  // if (
  //   repo === "ant-design/ant-design" &&
  //   exclude.length === 0 &&
  //   chart === "bubble"
  // ) {
  //   exclude.push(...["^(?!ant-design-bot$).*$"]);
  // }

  let latestMonth: number | null = null;
  let startDate: string | null = null;
  let endDate: string | null = null;

  // 开放最近 1-12 个月
  if (latestMonthParam) {
    latestMonth = Number(latestMonthParam);
    if (isNaN(latestMonth)) {
      latestMonth = null;
    } else if (latestMonth >= 1 && latestMonth <= 12) {
      // 当前
      endDate = dayjs().subtract(1, 'month').format('YYYY-MM');
      startDate = dayjs().subtract(latestMonth, 'month').format('YYYY-MM');
    }
  }

  return {
    repo,
    chart,
    exclude,
    startDate,
    endDate,
    latestMonth,
    recache,
    legend,
  };
};

export interface BaseNodeData extends d3.SimulationNodeDatum {
  avatar: string;
  name: string;
  totalScore: number;
  pr: number;
  totalComment: number;
  issue: number;
  discussion: number;
  no: number;
  id: string | number;
  bubbleType: 'pr' | 'issue' | 'discussion';
  // bubble 用到
  count: number;
}

export async function downloadAvatars(avatarUrls: string[]) {
  const downloadTask = async (avatarUrl: string) => {
    try {
      const response = await fetch(avatarUrl);

      const arrayBuffer = await response.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);

      return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error) {
      console.log('下载用户头像失败：', avatarUrl);
      throw error;
    }
  };

  const tasks: Promise<string>[] = [];

  const limit = pLimit(5);

  for (const avatarUrl of avatarUrls) {
    tasks.push(limit(() => downloadTask(avatarUrl)));
  }

  const result = await Promise.all(tasks);

  return result;
}

// 计算文本长度
export const calculateTextWidth = ({
  font,
  text,
  fontSize,
  letterSpacing = 0,
}: {
  font: opentypejs.Font;
  text: string;
  fontSize: number;
  letterSpacing?: number;
}) => {
  // 计算字间距的像素值
  const letterSpacingPx = letterSpacing * fontSize;
  // 计算不带字间距的文本宽度
  let width = 0;
  let totalAdvance = 0;

  // 遍历每个字符
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    totalAdvance += glyph.advanceWidth || 0;
  }

  // 将字形单位转换为像素
  width = (totalAdvance * fontSize) / font.unitsPerEm;

  // 添加字间距的贡献 (n-1个字符间距)
  const spacingContribution = letterSpacingPx * (text.length - 1);

  // 最终宽度
  const totalWidth = width + spacingContribution;

  return totalWidth;
};

export interface FetchDataParams {
  repo: string;
  excludeUsers?: string[];
  includeUsers?: string[];
  size?: number;
  startDate?: string | null;
  endDate?: string | null;
  sortBy?: 'totalScore' | 'pr' | 'issue' | 'discussion';
  autoDownloadAvatar?: boolean;
  requestEtag?: string;
  lastModified?: string;
  avatarSize?: number;
}

export interface ContributorData {
  username: string;
  prCount: number;
  prMergedCount: number;
  prCommentCount: number;
  issueCount: number;
  issueCommentCount: number;
  discussionCount: number;
  discussionCommentCount: number;
  discussionAnsweredCount: number;
  totalScore: number;
}

interface DataResult {
  statusCode: number;
  responseEtag?: string;
  responseLastModified?: string;
  data: BaseNodeData[];
}

export async function fetchData({
  repo,
  excludeUsers = [],
  includeUsers = [],
  size = 10,
  startDate,
  endDate,
  sortBy = 'totalScore',
  autoDownloadAvatar = true,
  requestEtag,
  lastModified,
  avatarSize = 96,
}: FetchDataParams): Promise<DataResult> {
  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    throw Error('Repository format is incorrect');
  }

  const filterUsers: string[] = [];
  // 特殊处理 lobe
  if (excludeUsers.length === 0 && owner === 'lobehub') {
    excludeUsers.push('^(?!lobehubbot$).*$');
  }

  filterUsers.push(...excludeUsers);
  filterUsers.push(...includeUsers);

  const url = new URL(
    `${process.env.API_BASE_URL}/github/statistics/${owner}/${repoName}`,
  );

  const bodyDaya: Record<string, unknown> = {
    page: 1,
    size,
    sortBy,
    filterUsers: filterUsers,
  };

  if (startDate && endDate) {
    bodyDaya.startDate = startDate;
    bodyDaya.endDate = endDate;
  }

  const requestHeaders = new Headers();
  requestHeaders.append('Accept', '*/*');
  requestHeaders.append('Content-Type', 'application/json');

  if (requestEtag) {
    requestHeaders.append('If-None-Match', requestEtag);
  }

  if (lastModified) {
    requestHeaders.append('If-Modified-Since', lastModified);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(bodyDaya),
    signal: AbortSignal.timeout(30 * 1000),
  });

  const statusCode = response.status;
  let responseEtag: string | undefined = undefined;
  let responseLastModified: string | undefined = undefined;

  if (statusCode === 200) {
    responseEtag = response.headers.get('Etag') ?? undefined;
    responseLastModified = response.headers.get('Last-Modified') ?? undefined;
  }

  if (!response.ok && statusCode !== 304) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const responseData =
    statusCode === 304
      ? { total: 0, data: [] }
      : ((await response.json()) as {
          total: number;
          data: ContributorData[];
        });

  const data = responseData.data;

  const avatarUrls = (data || []).map(
    (member) =>
      `https://avatars.githubusercontent.com/${member?.username}?s=${avatarSize}`,
  );

  const avatars = autoDownloadAvatar
    ? await downloadAvatars(avatarUrls)
    : avatarUrls;

  let results = (data || [])?.map((member, index: number) => {
    return {
      id: index,
      avatar: avatars[index],
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
      totalComment:
        (member?.prCommentCount || 0) +
        (member?.issueCommentCount || 0) +
        (member?.discussionCommentCount || 0),
    };
  });

  results.sort((a, b) => b.totalScore - a.totalScore);

  results = results.map((item, index) => ({ ...item, no: index + 1 }));

  return {
    statusCode,
    responseEtag,
    responseLastModified,
    data: results as unknown as BaseNodeData[],
  };
}

export const fetchMergedData = async (params: {
  repo: string;
  excludeUsers?: string[];
  includeUsers?: string[];
  startDate?: string | null;
  endDate?: string | null;
  requestEtag?: string;
  lastModified?: string;
  avatarSize?: number;
  pageSize?: number;
  sortBy?: string;
}): Promise<DataResult> => {
  const {
    repo,
    excludeUsers = [],
    includeUsers = [],
    startDate,
    endDate,
    requestEtag,
    lastModified,
    avatarSize = 96,
    pageSize = 7,
    sortBy = 'pr/issue/discussion',
  } = params;
  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    throw Error('Repository format is incorrect');
  }

  const filterUsers: string[] = [];
  // 特殊处理 lobe
  if (excludeUsers.length === 0 && owner === 'lobehub') {
    excludeUsers.push('^(?!lobehubbot$).*$');
  }

  filterUsers.push(...excludeUsers);
  filterUsers.push(...includeUsers);

  const url = new URL(
    `${process.env.API_BASE_URL}/github/statistics/merge/${owner}/${repoName}`,
  );

  const bodyDaya: Record<string, unknown> = {
    size: pageSize,
    sortBy: sortBy,
    filterUsers,
  };

  if (startDate && endDate) {
    bodyDaya.startDate = startDate;
    bodyDaya.endDate = endDate;
  }

  const requestHeaders = new Headers();
  requestHeaders.append('Accept', '*/*');
  requestHeaders.append('Content-Type', 'application/json');

  if (requestEtag) {
    requestHeaders.append('If-None-Match', requestEtag);
  }

  if (lastModified) {
    requestHeaders.append('If-Modified-Since', lastModified);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(bodyDaya),
    signal: AbortSignal.timeout(30 * 1000),
  });

  const statusCode = response.status;
  let responseEtag: string | undefined = undefined;
  let responseLastModified: string | undefined = undefined;

  if (statusCode === 200) {
    responseEtag = response.headers.get('Etag') ?? undefined;
    responseLastModified = response.headers.get('Last-Modified') ?? undefined;
  }

  if (!response.ok && statusCode !== 304) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const responseData =
    statusCode === 304
      ? { pr: [], issue: [], discussion: [] }
      : ((await response.json()) as {
          pr?: ContributorData[];
          issue?: ContributorData[];
          discussion?: ContributorData[];
        });

  const prData = (responseData.pr || []).map((item) => ({
    ...item,
    bubbleType: 'pr',
    count: item.prCount,
  }));

  const issueData = (responseData.issue || []).map((item) => ({
    ...item,
    bubbleType: 'issue',
    count: item.issueCount,
  }));

  const discussionData = (responseData.discussion || []).map((item) => ({
    ...item,
    bubbleType: 'discussion',
    count: item.discussionCount,
  }));

  // 排序
  prData.sort((a, b) => b.totalScore - a.totalScore);
  issueData.sort((a, b) => b.totalScore - a.totalScore);
  discussionData.sort((a, b) => b.totalScore - a.totalScore);

  // 按照图例顺序
  const list = [...issueData, ...prData, ...discussionData].map((item) => ({
    ...item,
    name: item.username,
    totalScore: Number(((item.totalScore || 0) as number).toFixed(1)),
    avatar: `https://avatars.githubusercontent.com/${item.username}?s=${avatarSize}`,
  }));

  const avatars = await downloadAvatars(list.map((item) => item.avatar));

  const results = list.map((item, i) => ({ ...item, avatar: avatars[i] }));

  return {
    responseEtag,
    responseLastModified,
    statusCode,
    data: results as unknown as BaseNodeData[],
  };
};

export const getDataResult = async ({
  repo,
  chart,
  pageSize,
  sortBy,
  excludeUsers,
  startDate,
  endDate,
  requestEtag,
  lastModified,
}: {
  repo: string;
  chart: ChartType;
  pageSize?: number;
  sortBy?: string;
  excludeUsers?: string[];
  startDate?: string | null;
  endDate?: string | null;
  requestEtag?: string;
  lastModified?: string;
}) => {
  let avatarSize: number | undefined = undefined;

  if (chart === 'podium') {
    avatarSize = 256;
  }

  return chart === 'bubble'
    ? await fetchMergedData({
        repo,
        excludeUsers,
        startDate,
        endDate,
        pageSize,
        sortBy,
        requestEtag: requestEtag,
        lastModified,
        avatarSize,
      })
    : await fetchData({
        repo,
        excludeUsers,
        size: pageSize,
        startDate,
        endDate,
        requestEtag: requestEtag,
        lastModified,
        avatarSize,
      });
};
