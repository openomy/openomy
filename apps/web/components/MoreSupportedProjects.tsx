'use client';

import { motion } from 'framer-motion';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@openomy/ui/components/ui/avatar';
import { GithubStarButton } from './github-star-button';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font/dist/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RepoItem {
  repoName: string;
  repoPath: string;
  defaultStarCount: string;
  logoUrl: string;
}

const repoList: RepoItem[] = [
  {
    repoName: 'Gin-Vue-Admin',
    repoPath: 'flipped-aurora/gin-vue-admin',
    defaultStarCount: '22.9k',
    logoUrl: '/images/gin-vue-admin-logo.png',
  },
  {
    repoName: 'Antvis G2',
    repoPath: 'antvis/G2',
    defaultStarCount: '22.9k',
    logoUrl: '/images/antvis-logo.png',
  },
  {
    repoName: 'Antvis G6',
    repoPath: 'antvis/G6',
    defaultStarCount: '11.5k',
    logoUrl: '/images/antvis-logo.png',
  },
  {
    repoName: 'Ant Design X',
    repoPath: 'ant-design/x',
    defaultStarCount: '3.3k',
    logoUrl: '/images/ant-design-x-logo.svg',
  },
  {
    repoName: 'Ant Design X Vue',
    repoPath: 'wzc520pyfm/ant-design-x-vue',
    defaultStarCount: '1.4k',
    logoUrl: '/images/ant-design-x-logo.svg',
  },
  {
    repoName: 'Ant Design Web3',
    repoPath: 'ant-design/ant-design-web3',
    defaultStarCount: '1k',
    logoUrl: '/images/ant-design-web3-logo.svg',
  },
  {
    repoName: 'Valaxy',
    repoPath: 'YunYouJun/valaxy',
    defaultStarCount: '895',
    logoUrl: '/images/valaxy-logo.svg',
  },
  {
    repoName: 'Shuimo UI',
    repoPath: 'shuimo-design/shuimo-ui',
    defaultStarCount: '300',
    logoUrl: '/images/shuimo-ui-logo.svg',
  },
  {
    repoName: 'jzero',
    repoPath: 'jzero-io/jzero',
    defaultStarCount: '102',
    logoUrl: '/images/jzero-logo.jpeg',
  },
  {
    repoName: 'Element-Plus-X',
    repoPath: 'element-plus-x/Element-Plus-X',
    defaultStarCount: '929',
    logoUrl: '/images/vue-element-plus-x.png',
  },
  {
    repoName: 'vue-vben-admin',
    repoPath: '/vbenjs/vue-vben-admin',
    defaultStarCount: '30.2k',
    logoUrl: '/images/vue-vben-admin-logo.webp',
  },
  {
    repoName: 'soybean-admin',
    repoPath: '/soybeanjs/soybean-admin',
    defaultStarCount: '13.3k',
    logoUrl: '/images/soybean-admin-logo.svg',
  }
];

export function MoreSupportedProjects({
  localFont,
}: {
  localFont: NextFontWithVariable;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col p-6 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl tracking-tight font-semibold mb-6">
          More Ecosystem Github Projects
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {repoList.map((item, index) => (
            <div
              key={item.repoPath}
              className={cn(
                'bg-black/30 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10',
                index > 3 && 'hidden xl:block',
              )}
            >
              {/* Project Title */}
              <motion.h2
                className={`flex items-center gap-x-2 text-white text-2xl font-extrabold mb-2 ${localFont.className}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Link
                  href={`/github/${item.repoPath}`}
                  className="hover:underline underline-offset-6 flex items-center gap-x-2 pointer-events-auto"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={item.logoUrl} alt="avatar" />
                    <AvatarFallback>{item.repoName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {item.repoName}
                </Link>
              </motion.h2>

              {/* Star Count */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="pointer-events-auto">
                  <GithubStarButton
                    repoPath={item.repoPath}
                    defaultStarCount={item.defaultStarCount}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
