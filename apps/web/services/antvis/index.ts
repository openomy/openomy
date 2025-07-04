import type { AntvOscpData } from '@/types/oscp';
import allData from './antv-oscp.json';

type OscpItem = {
  Title: string;
  URL: string;
  Assignees: string;
  Status: 'Done' | 'In Progress' | 'Need Triage';
  Repository: string;
  Labels: string;
  '🎁 任务积分': string;
  'Linked pull requests': string;
  Priority: string;
};

export async function getOscpData() {
  const allOscpData = allData as unknown as OscpItem[];

  const userMap: Map<string, AntvOscpData> = new Map();

  allOscpData.forEach((item) => {
    const username = item.Assignees.toLowerCase();

    if (username) {
      const isDone = item.Status === 'Done';
      const isInProgress = item.Status === 'In Progress';
      const numberScore = Number(item['🎁 任务积分'] || '0');
      const score = !isNaN(numberScore) ? numberScore : 0;
      const status = isDone ? 'done' : 'processing';

      const currentUserData = userMap.get(username);
      if (currentUserData) {
        // 只统计 done 和 processing
        if (isDone || isInProgress) {
          currentUserData.tasks = [
            ...currentUserData.tasks,
            {
              title: item.Title,
              repo: item.Repository,
              issueLink: item.URL,
              score: score,
              status,
            },
          ];

          currentUserData.score = currentUserData.score + score;

          userMap.set(username, currentUserData);
        }
      } else {
        userMap.set(username, {
          name: username,
          avatar: `https://avatars.githubusercontent.com/${username}`,
          score: score,
          tasks: [
            {
              title: item.Title,
              repo: item.Repository,
              issueLink: item.URL,
              score: score,
              status,
            },
          ],
        });
      }
    }
  });

  const userValues = [...userMap.values()];

  // 项目方不参与排名
  const excludeUsers = ['yvonneyx', 'interstellarmt'].map((item) =>
    item.toLowerCase(),
  );
  const data = userValues.map((item) => {
    if (excludeUsers.includes(item.name.toLowerCase())) {
      return { ...item, score: 0 };
    }

    return item;
  });

  data.sort((a, b) => b.score - a.score);

  // 前三名单独加分
  const extraSocres = [200, 100, 50];
  for (let i = 0; i < extraSocres.length; i++) {
    const extraSocre = extraSocres[i];
    data[i].score = data[i].score + extraSocre;
    data[i].extraScore = extraSocre;
  }

  return data;
}
