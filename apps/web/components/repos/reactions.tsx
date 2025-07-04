import { Badge } from '@openomy/ui/components/ui/badge';

export const reactionEmojiMap: Record<string, string> = {
  '+1': '👍',
  thumbs_up: '👍',
  thumbsUp: '👍',
  '-1': '👎',
  thumbs_down: '👎',
  thumbsDown: '👎',
  laugh: '😄',
  hooray: '🎉',
  confused: '😕',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

export function Reactions({
  reactions,
}: {
  reactions: Record<string, number>;
}) {
  const reactionKeys = Object.keys(reactions);

  console.log('reactions', reactions);

  return (
    <div className="grid grid-cols-4 gap-x-1 gap-y-1 w-[180px]">
      {reactionKeys.map((reactionName) => {
        const count = reactions[reactionName];
        if (typeof count === 'number') {
          return (
            <Badge
              key={reactionName}
              variant="outline"
              className="rounded-[12px] dark:bg-[#2F2E00] whitespace-nowrap shadow-[inset_0px_0px_0px_0.5px_#474700]"
            >{`${
              reactionEmojiMap[reactionName.toLowerCase()] ||
              reactionName.toLowerCase()
            } ${count}`}</Badge>
          );
        }

        return null;
      })}
    </div>
  );
}
