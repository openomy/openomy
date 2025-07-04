/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Skeleton } from '@openomy/ui/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function PartyPoster({
  owner,
  projectId,
  className,
}: {
  owner: string;
  projectId: string;
  className?: string;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      {loading && (
        <Skeleton className="min-h-[360px] md:min-h-[540px] w-full rounded-xl" />
      )}
      <img
        alt="Party Poster"
        src={`/party/${owner}/${projectId}/svg`}
        className={cn(
          'w-full rounded-xl object-contain',
          className,
          loading && 'hidden',
        )}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </>
  );
}
