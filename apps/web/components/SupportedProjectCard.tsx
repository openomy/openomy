'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@openomy/ui/components/ui/avatar';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font/dist/types';
import { motion } from 'framer-motion';
import { GitHubLogoIcon, StarFilledIcon } from '@radix-ui/react-icons';
import { useGithubRepo } from '@/hooks/use-github-repo';
import Link from 'next/link';

export const SupportedProjectCard = ({
  githubRepoName,
  githubRepo,
  defaultStars,
  localFont,
  logoUrl,
}: {
  githubRepoName: string;
  githubRepo: string;
  defaultStars: string;
  localFont: NextFontWithVariable;
  logoUrl: string;
}) => {
  const { data: githubRepoData, isLoading } = useGithubRepo(githubRepo);

  return (
    <motion.div
      className="absolute inset-0 flex items-center z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 md:px-8 w-full">
        <div className="flex justify-end">
          {' '}
          {/* Keep flex and justify-end for desktop */}
          <motion.div
            className="w-full md:max-w-md" // Full width on mobile, max-width on desktop
            initial={{ y: 30, opacity: 0, x: 30 }}
            animate={{ y: 0, opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* GitHub Project Card */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/10">
              {/* GitHub Logo and Project Text */}
              <div className="flex items-center mb-2">
                <span
                  className={`text-white/48 text-sm md:text-sm ${localFont.className}`}
                >
                  Ecosystem Github Project
                </span>
              </div>

              {/* Project Title */}
              <motion.h2
                className={`flex items-center gap-x-2 text-white text-3xl md:text-4xl font-extrabold mb-2 ${localFont.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Link
                  href={`/github/${githubRepo}`}
                  className="hover:underline underline-offset-6 flex items-center gap-x-2 pointer-events-auto"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={logoUrl} alt="avatar" />
                    <AvatarFallback>{githubRepoName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {githubRepoName}
                </Link>
              </motion.h2>

              {/* Star Count */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="pointer-events-auto">
                  <a
                    href={`https://github.com/${githubRepo}`}
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
                          ? defaultStars
                          : githubRepoData?.formatted_star_count
                            ? githubRepoData?.formatted_star_count
                            : defaultStars}
                      </span>
                      <StarFilledIcon className="w-4 h-4 ml-1 text-[#171717]" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
