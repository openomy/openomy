'use client';

import { RepoContributorsDataTable } from '@/components/repo-contributors/data-table';
import { useParams } from 'next/navigation';
import { ReadmeWidgets } from './readme-widgets';
import { Waitlist } from '@/components/waitlist';
import { Footer } from '@/components/footer';
import { RepoHeader } from '@/components/repos/header';

export function RepoPageClient() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 py-6 space-y-6">
        <div>
          <RepoHeader owner={owner} repo={repo} />
        </div>

        <Waitlist className="" backFillRepoUrl={false} />
        <ReadmeWidgets owner={owner} repo={repo} className="" />

        <RepoContributorsDataTable owner={owner} repo={repo} />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 py-6">
        <Footer />
      </div>
    </div>
  );
}
