import { Badge } from '@/components/ui/badge';

interface BookmarkListProps {
  bookmarks: Array<{ title: string; url: string; group?: string }>;
  showGroup?: boolean;
}

export function BookmarkList({
  bookmarks,
  showGroup = false
}: BookmarkListProps) {
  // 按分组整理书签
  const bookmarksByGroup = bookmarks.reduce(
    (acc, bookmark) => {
      const group = bookmark.group || '未分组';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(bookmark);
      return acc;
    },
    {} as Record<string, typeof bookmarks>
  );

  return (
    <div className='space-y-6'>
      {Object.entries(bookmarksByGroup).map(([group, groupBookmarks]) => (
        <div key={group} className='space-y-1'>
          {showGroup && (
            <h3 className='mb-2 border-b pb-1 text-sm font-semibold'>
              {group}
            </h3>
          )}
          <div className='flex flex-wrap gap-x-3 gap-y-2'>
            {groupBookmarks.map((bookmark) => (
              <a
                key={`${bookmark.group}-${bookmark.title}`}
                href={bookmark.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:text-primary/80 text-sm transition-colors hover:underline'
                title={bookmark.url}
              >
                {bookmark.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
