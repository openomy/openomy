import { RepoPageClient } from './page-client';
import { notFound, redirect } from 'next/navigation';

async function getSyncedRepos() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/github/repo`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error(`${response.status}-${await response.text()}`);
    }

    const list = await response.json();

    return list as string[];
  } catch (error) {
    if ((error as Error).name === 'TimeoutError') {
      console.log('/github/repo 请求超时：', error);
      redirect('/');
    }
    console.log(`获取同步仓库失败: ${(error as Error).message}`);
    return [];
  }
}

export default async function RepoPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;

  const whitelist = await getSyncedRepos();

  const inWhitelist = whitelist
    .map((item) => item.toLowerCase())
    .includes(`${owner}/${repo}`.toLowerCase());

  if (!inWhitelist) {
    notFound();
  }

  return <RepoPageClient />;
}
