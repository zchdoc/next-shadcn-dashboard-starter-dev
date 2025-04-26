import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface BookmarkCardProps {
  title: string;
  url: string;
  settings: {
    showCardHeader: boolean;
    showCardTitle: boolean;
    showCardDescription: boolean;
    showHoverCard: boolean;
    showCardContent: boolean;
    showBadge: boolean;
  };
  group?: string;
  isFirstInGroup?: boolean;
}

export function BookmarkCard({
  title,
  url,
  settings,
  group,
  isFirstInGroup
}: BookmarkCardProps) {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  const card = (
    <Card
      className={`cursor-pointer transition-colors ${
        isFirstInGroup
          ? 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40'
          : 'hover:bg-accent'
      }`}
      onClick={handleClick}
    >
      {settings.showCardHeader && (
        <CardHeader className='p-4'>
          {settings.showCardTitle && (
            <CardTitle className='flex w-full flex-col items-center gap-2 text-base'>
              <span className='mx-auto w-[90%] truncate text-center'>
                {title}
              </span>
              {group && settings.showBadge && (
                <Badge variant='secondary'>{group}</Badge>
              )}
            </CardTitle>
          )}
          {settings.showCardDescription && (
            <CardDescription className='truncate'>{url}</CardDescription>
          )}
        </CardHeader>
      )}
      {settings.showCardContent && (
        <CardContent className='p-4 pt-0'>
          <div className='text-muted-foreground truncate text-sm'>{url}</div>
        </CardContent>
      )}
    </Card>
  );

  if (settings.showHoverCard) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>{card}</HoverCardTrigger>
        <HoverCardContent className='w-80'>
          <div className='space-y-2'>
            <h5 className='text-sm font-semibold'>
              {title}
              {group && settings.showBadge && (
                <Badge variant='secondary' className='ml-2'>
                  {group}
                </Badge>
              )}
            </h5>
            <p className='text-muted-foreground text-sm break-all'>{url}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return card;
}
