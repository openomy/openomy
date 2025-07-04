'use client';

import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@openomy/ui/components/ui/avatar';
import { ImageIcon } from 'lucide-react';

export function RepoHeader({ owner, repo }: { owner: string; repo: string }) {
  return (
    <Link
      href={`https://github.com/${owner}/${repo}`}
      className="inline-flex items-center justify-start gap-x-2"
    >
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={`https://avatars.githubusercontent.com/${owner}`}
          alt="project avatar"
          className="w-10 h-10"
        />
        <AvatarFallback>
          <ImageIcon className="w-10 h-10" />
        </AvatarFallback>
      </Avatar>
      <h1 className="text-3xl font-bold tracking-tight hover:underline">
        {owner}/{repo}
      </h1>
    </Link>
  );
}
