'use client';

import { useGithubRepo } from '@/hooks/use-github-repo';
import { GitHubLogoIcon, StarFilledIcon } from '@radix-ui/react-icons';

export interface StarButtonProps {
  defaultStarCount: string;
  repoPath: string;
}

export function GithubStarButton({
  defaultStarCount,
  repoPath,
}: StarButtonProps) {
  const { data, isLoading } = useGithubRepo(repoPath);
  return (
    <a
      href={`https://github.com/${repoPath}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
    >
      <div className="flex items-center h-8 px-2 py-0 bg-[#f6f8fa] border border-[#d0d7de] rounded-l-md hover:bg-[#f3f4f6] transition-colors">
        <GitHubLogoIcon className="w-4 h-4 text-[#171717]" />
      </div>
      <div className="flex items-center h-8 min-w-[32px] px-2 py-0 bg-[#f6f8fa] border border-[#d0d7de] border-l-0 rounded-r-md hover:bg-[#f3f4f6] transition-colors">
        <span className="text-xs font-medium text-[#24292f]">
          {isLoading
            ? defaultStarCount
            : data?.formatted_star_count
              ? data?.formatted_star_count
              : defaultStarCount}
        </span>
        <StarFilledIcon className="w-4 h-4 ml-1 text-[#171717]" />
      </div>
    </a>
  );
}
