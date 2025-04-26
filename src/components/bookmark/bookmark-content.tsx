import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
// useCallback
import { useEffect, useState } from 'react';
import { BookmarkCard } from './bookmark-card';
import { BookmarkSettings } from './bookmark-settings';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BookmarkContentProps {
  bookmarks: Array<{ title: string; url: string; group?: string }>;
  groupTitle: string;
  cardsPerRow?: GridColsKey;
  showGroup?: boolean;
  settingsKey?: string;
}

type GridColsKey = 1 | 2 | 3 | 4 | 6 | 8 | 10;

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  8: 'grid-cols-8',
  10: 'grid-cols-10'
} as const;

type BookmarkSettings = {
  cardsPerRow: GridColsKey;
  gap: number;
  showCardHeader: boolean;
  showCardTitle: boolean;
  showCardDescription: boolean;
  showHoverCard: boolean;
  showCardContent: boolean;
  showBadge: boolean;
};

const defaultSettings: BookmarkSettings = {
  cardsPerRow: 2,
  gap: 4,
  showCardHeader: true,
  showCardTitle: true,
  showCardDescription: true,
  showHoverCard: true,
  showCardContent: true,
  showBadge: true
};

export function BookmarkContent({
  bookmarks,
  groupTitle,
  cardsPerRow = 2,
  showGroup = false,
  settingsKey = ''
}: BookmarkContentProps) {
  const [isClient, setIsClient] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<BookmarkSettings>({
    ...defaultSettings,
    cardsPerRow: cardsPerRow
  });

  // 使用 groupTitle 作为存储键的一部分，使不同页面的设置相互独立
  console.info('BookmarkContent-groupTitle:', settingsKey);
  const storageKey = `bookmarkSettings-${settingsKey}`;

  // 在客户端加载时从 localStorage 读取设置
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedSettings = window.localStorage.getItem(storageKey);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [storageKey]);

  // 保存设置到 localStorage
  const saveSettings = () => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  };

  // 清除设置
  const clearSettings = () => {
    localStorage.removeItem(storageKey);
    setSettings({
      ...defaultSettings,
      cardsPerRow: cardsPerRow
    });
  };

  // 处理设置变更
  const handleSettingChange = <K extends keyof BookmarkSettings>(
    key: K,
    value: BookmarkSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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
    <Card className='flex h-full flex-col rounded-none border-0'>
      <CardHeader className='flex-shrink-0 space-y-0 pb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>{groupTitle}</CardTitle>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>
        {showSettings && (
          <CardDescription>
            <BookmarkSettings
              settings={settings}
              onSettingChange={handleSettingChange}
              onSave={saveSettings}
              onClear={clearSettings}
              bookmarkCount={bookmarks.length}
              gridOptions={Object.keys(gridCols)}
            />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className='min-h-0 flex-1 overflow-y-auto pt-0'>
        <div className='space-y-6'>
          {Object.entries(bookmarksByGroup).map(([group, groupBookmarks]) => (
            <div key={group} className='space-y-2'>
              {/*<h3 className="font-semibold text-sm">{group}</h3>*/}
              <div
                className={`grid ${
                  isClient
                    ? gridCols[settings.cardsPerRow]
                    : gridCols[cardsPerRow]
                } gap-${isClient ? settings.gap : 4}`}
              >
                {groupBookmarks.map((bookmark, index) => (
                  <BookmarkCard
                    key={`${bookmark.group}-${bookmark.title}`}
                    title={bookmark.title}
                    url={bookmark.url}
                    settings={settings}
                    group={
                      showGroup && settings.showBadge
                        ? bookmark.group
                        : undefined
                    }
                    isFirstInGroup={index === 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
