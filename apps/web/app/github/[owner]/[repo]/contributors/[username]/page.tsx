import React from 'react';
import { Bricolage_Grotesque } from 'next/font/google';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@openomy/ui/components/ui/tabs';
import { ContributorIssuesTable } from '@/components/contributor-issues/data-table';
import { ContributorDiscussionsTable } from '@/components/contributor-discussions/data-table';
import { ContributorPRCommentsTable } from '@/components/contributor-pr-comments/data-table';
import { ContributorIssueCommentsTable } from '@/components/contributor-issue-comments/data-table';
import { ContributorDiscussionCommentsTable } from '@/components/contributor-discussion-comments/data-table';
import { ContributorPRsTable } from '@/components/contributor-prs/data-table';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';
import { PageBreadcrumb } from './breadcrumb';
import { ContributorProfile } from './contributor-profile';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export default async function UserPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; username: string }>;
}) {
  const { owner, repo, username } = await params;

  const tabsBtnCls =
    'inline-flex items-center border-t-0 border-r-0 border-l-0 justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative h-9 rounded-none border-b-2 px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none dark:data-[state=active]:bg-background data-[state=active]:border-b-primary dark:data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-8 py-6">
        <div className="space-y-4">
          <PageBreadcrumb />
          <ContributorProfile
            owner={owner}
            repo={repo}
            username={username}
            className={bricolageGrotesque.className}
          />
          <Tabs defaultValue="issues" className="gap-8">
            <TabsList className="h-auto text-muted-foreground w-full rounded-none border-b bg-transparent p-0">
              <div className="w-full max-w-full overflow-x-auto  overflow-y-hidden">
                <div className="h-9 whitespace-nowrap">
                  <TabsTrigger value="issues" className={cn(tabsBtnCls)}>
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="prs" className={cn(tabsBtnCls)}>
                    Pull Requests
                  </TabsTrigger>
                  <TabsTrigger value="discussions" className={cn(tabsBtnCls)}>
                    Discussions
                  </TabsTrigger>
                  <TabsTrigger value="issueComments" className={cn(tabsBtnCls)}>
                    Issue Comments
                  </TabsTrigger>
                  <TabsTrigger value="prComments" className={cn(tabsBtnCls)}>
                    PR Comments
                  </TabsTrigger>
                  <TabsTrigger
                    value="discussionComments"
                    className={cn(tabsBtnCls)}
                  >
                    Discussion Comments
                  </TabsTrigger>
                </div>
              </div>
            </TabsList>
            <TabsContent value="issues" className="TabsContent">
              <ContributorIssuesTable
                owner={owner}
                repo={repo}
                username={username}
              />
            </TabsContent>
            <TabsContent value="prs">
              <ContributorPRsTable
                owner={owner}
                repo={repo}
                username={username}
              />
            </TabsContent>
            <TabsContent value="discussions">
              <ContributorDiscussionsTable
                owner={owner}
                repo={repo}
                username={username}
              />
            </TabsContent>
            <TabsContent value="issueComments">
              <ContributorIssueCommentsTable
                owner={owner}
                repo={repo}
                username={username}
              />
            </TabsContent>
            <TabsContent value="prComments">
              <ContributorPRCommentsTable
                owner={owner}
                repo={repo}
                username={username}
              />
            </TabsContent>
            <TabsContent value="discussionComments">
              <ContributorDiscussionCommentsTable
                owner={owner}
                repo={repo}
                username={username}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 py-6">
        <Footer />
      </div>
    </div>
  );
}
