import { Card, CardContent } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

interface HoverTextProps {
  text: string;
  className?: string;
  showHover?: boolean;
}

export function HoverText({
  text,
  className = '',
  showHover = true
}: HoverTextProps) {
  if (!showHover) {
    return <p className={`truncate ${className}`}>{text}</p>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger className='w-full'>
        <p className={`cursor-pointer truncate ${className}`}>{text}</p>
      </HoverCardTrigger>
      <HoverCardContent align='start' className='w-[400px]'>
        <Card>
          <CardContent className='p-2 break-all'>{text}</CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
}
