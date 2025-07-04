'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { PartyPoster } from './party-poster';
import { PartyContributorsTable } from './data-table';
import { PartyOverview, type PartyData } from './party-overview';
import { Footer } from '@/components/footer';
import { useState } from 'react';

const partyData: PartyData = {
  id: 31,
  title: '2025 AntV OSCP Season of Docs',
  description: `<p>2025 AntV 开源贡献计划 OSCP Phase3 文档季，聚焦 G2/G6 库，共发布 130+ 项文档优化任务，涵盖内容补充、结构调整、示例丰富等方向，全面提升文档的可读性与开发体验。</p> <p>活动期间，36 位社区贡献者携手参与，为 AntV 文档生态注入源源不断的能量。感谢每一份认真修订与每一次用心提交，正是你们，让开源更有温度 ❤️</p> <p>详细信息请见：<a class="underline underline-offset-4 hover:text-primary" target="_blank" href="https://github.com/antvis/G2/issues/6660">https://github.com/antvis/G2/issues/6660</a></p>`,
  startDate: '2025-03-19 00:00:00',
  endDate: '2025-05-30 23:59:59',
  participants: 37,
};

export function PartyDetailPageClient({
  owner,
  projectId,
}: {
  owner: string;
  projectId: string;
}) {
  const [totalContributors, setTotalContributors] = useState(36);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 max-w-6xl">
      <PartyOverview data={{ ...partyData, participants: totalContributors }} />

      <Card className="mb-8 p-0 min-h-[360px] md:min-h-[540px]">
        <div className="flex items-center justify-center">
          <PartyPoster owner={owner} projectId={projectId} />
        </div>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Contributors</CardTitle>
          <CardDescription>
            Thank you to all community members who have contributed to the
            project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartyContributorsTable
            owner={owner}
            projectId={projectId}
            onTotalCountChange={(count) => {
              if (count) {
                setTotalContributors(count);
              }
            }}
          />
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}
