import { Badge } from '@repo/ui/components/ui/badge';

export function Labels({ labels }: { labels: string[] }) {
  return (
    <div className="inline-flex items-center flex-wrap gap-x-1 gap-y-1">
      {labels.map((label) => (
        <Badge
          key={label}
          variant="secondary"
          className="whitespace-nowrap dark:bg-[#343434] rounded-[6px]"
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}
