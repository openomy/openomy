'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export function ScoreHint() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="inline-flex items-center flex-nowrap">
          <span>Score</span>
          <InfoIcon className="w-3.5 h-3.5 ml-1" />
        </div>
      </TooltipTrigger>
      <TooltipContent align="center" side="top">
        Contributions are recognized in every rank, with scores reflecting
        relative efforts.​
      </TooltipContent>
    </Tooltip>
  );
}
