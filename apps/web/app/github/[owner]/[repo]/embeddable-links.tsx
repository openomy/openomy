'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@openomy/ui/components/ui/button';
import { useCopyToClipboard } from '@openomy/ui/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

interface EmbeddableLinkProps {
  owner: string;
  repo: string;
  className?: string;
}

export function EmbeddableLinks({
  owner,
  repo,
  className,
}: EmbeddableLinkProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
    onCopy: () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    },
  });

  const getEmbedCode = () => {
    const baseUrl = 'https://openomy.com';
    const imageUrl = `${baseUrl}/svg?repo=${owner}/${repo}&chart=bubble&latestMonth=3`;
    const repoUrl = `${baseUrl}/${owner}/${repo}`;
    return `<a href="${repoUrl}" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="${imageUrl}" target="_blank" alt="Contribution Leaderboard" style="display: block; width: 100%;" />
</a>`;
  };

  const handleCopy = () => {
    const embedCode = getEmbedCode();
    copyToClipboard(embedCode);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-lg border border-gray-800 bg-black/40 backdrop-blur-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-100">Embed in Your Github Repo</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-6 w-6 hover:bg-white/10"
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-gray-400" />
            )}
          </Button>
        </div>
        
        <p className="text-sm text-gray-400">
          Copy the markdown snippet below and paste it into your README.md to display a beautiful contributors chart.
        </p>
        
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Pro tip:</strong> You can customize the chart appearance by
          adding parameters to the URL. For example, add{' '}
          <code className="px-1.5 py-0.5 bg-gray-900/60 border border-gray-800 rounded text-xs text-gray-300">
            &latestMonth=6
          </code>{' '}
          to show the last 6 months of data.
        </p>

        <pre className="px-4 py-3 bg-gray-900/60 border border-gray-800 rounded-md text-sm font-mono overflow-x-auto">
          <code className="text-gray-300">{getEmbedCode()}</code>
        </pre>
      </div>
    </div>
  );
}
