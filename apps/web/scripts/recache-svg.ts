import dotenv from 'dotenv';

dotenv.config({ path: ['.env.development.local'] });

async function getSyncedRepos() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/github/repo`);

    if (!response.ok) {
      throw new Error(`${response.status}-${await response.text()}`);
    }

    const list = await response.json();

    return list as string[];
  } catch (error) {
    console.log(`获取同步仓库失败: ${(error as Error).message}`);
    return [];
  }
}

type ChartType = 'list' | 'histogram' | 'podium' | 'bubble';

const buildSvgUrl = ({ repo, chart }: { repo: string; chart: ChartType }) => {
  if (chart === 'bubble') {
    return `https://openomy.app/svg?repo=${repo}&chart=bubble&latestMonth=3&recache=1`;
  }
  return `https://openomy.app/svg?repo=${repo}&chart=${chart}&recache=1`;
};

const recacheSvg = async ({ chart }: { chart: ChartType }) => {
  const repoList = await getSyncedRepos();

  console.log('repoList', repoList);

  for (const repo of repoList) {
    const svgUrl = buildSvgUrl({ repo, chart });

    await fetch(svgUrl).catch((err) =>
      console.log(`重新生成错误: ${repo}`, err),
    );
    console.log(`✅重新生成 ${chart}: ${svgUrl}`);
  }
};

async function run() {
  await recacheSvg({ chart: 'bubble' });
}

run();
