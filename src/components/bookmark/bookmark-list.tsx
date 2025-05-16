import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface BookmarkListProps {
  bookmarks: Array<{ title: string; url: string; group?: string }>;
  showGroup?: boolean;
  alignment: 'left' | 'center' | 'right';
}

// 分组默认每行显示数量
const groupDefaultLinksPerRow: Record<string, number> = {
  'XB Client Login': 6,
  // 其它分组可自定义
  Tools: 6,
  Net: 6
};
const DEFAULT_LINKS_PER_ROW = 30;

export function BookmarkList({
  bookmarks,
  showGroup = false,
  alignment
}: BookmarkListProps) {
  // 用useMemo缓存分组，避免每次渲染都新建对象
  const bookmarksByGroup = useMemo(() => {
    return bookmarks.reduce(
      (acc, bookmark) => {
        const group = bookmark.group || '未分组';
        if (!acc[group]) acc[group] = [];
        acc[group].push(bookmark);
        return acc;
      },
      {} as Record<string, typeof bookmarks>
    );
  }, [bookmarks]);

  // 每组的每行链接数量
  const [linksPerRowMap, setLinksPerRowMap] = useState<Record<string, number>>(
    {}
  );

  // 初始化每组的默认值
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkListLinksPerRowMap');
    if (saved) {
      try {
        setLinksPerRowMap(JSON.parse(saved));
        return;
      } catch {}
    }
    // 没有保存时，按分组默认
    const map: Record<string, number> = {};
    for (const group of Object.keys(bookmarksByGroup)) {
      map[group] = groupDefaultLinksPerRow[group] || DEFAULT_LINKS_PER_ROW;
    }
    setLinksPerRowMap(map);
  }, [bookmarksByGroup]);

  useEffect(() => {
    localStorage.setItem(
      'bookmarkListLinksPerRowMap',
      JSON.stringify(linksPerRowMap)
    );
  }, [linksPerRowMap]);

  // 获取特定分组的每行链接数量
  const getLinksPerRow = (group: string) => {
    return (
      linksPerRowMap[group] ||
      groupDefaultLinksPerRow[group] ||
      DEFAULT_LINKS_PER_ROW
    );
  };

  // 计算每行显示的链接样式
  const getLinkStyle = () => ({
    flex: '0 0 auto',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    maxWidth: '100%'
  });

  // 更新特定分组的每行链接数量
  const updateLinksPerRow = (group: string, value: number) => {
    setLinksPerRowMap((prev) => ({
      ...prev,
      [group]: value
    }));
  };

  // 获取对齐样式
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <div className='space-y-6'>
      {/* 书签分组 */}
      {Object.entries(bookmarksByGroup).map(([group, groupBookmarks]) => {
        const linksPerRow = getLinksPerRow(group);
        // 按每行linksPerRow分组
        const rows = [];
        for (let i = 0; i < groupBookmarks.length; i += linksPerRow) {
          rows.push(groupBookmarks.slice(i, i + linksPerRow));
        }
        return (
          <div key={group} className='space-y-1'>
            {showGroup && (
              <div className='mb-2 flex items-center justify-between border-b pb-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm font-semibold'>{group}</h3>
                  {/* 分页风格步进器 */}
                  <div className='bg-muted flex h-6 items-center rounded-md border px-1'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      className='h-5 w-5 rounded p-0'
                      onClick={() =>
                        updateLinksPerRow(group, Math.max(1, linksPerRow - 1))
                      }
                      disabled={linksPerRow <= 1}
                      tabIndex={-1}
                    >
                      {'-'}
                    </Button>
                    <span className='w-8 text-center text-xs select-none'>
                      {linksPerRow}
                    </span>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      className='h-5 w-5 rounded p-0'
                      onClick={() =>
                        updateLinksPerRow(group, Math.min(30, linksPerRow + 1))
                      }
                      disabled={linksPerRow >= 30}
                      tabIndex={-1}
                    >
                      {'+'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* 每行整体居中排列 */}
            <div className='flex flex-col gap-y-2'>
              {rows.map((row) => (
                <div
                  key={row.map((b) => b.title).join('-')}
                  className={`flex flex-wrap ${getAlignmentClass()} w-full`}
                >
                  {row.map((bookmark) => (
                    <a
                      key={`${bookmark.group}-${bookmark.title}`}
                      href={bookmark.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary hover:text-primary/80 text-sm transition-colors hover:underline'
                      title={bookmark.url}
                      style={getLinkStyle()}
                    >
                      {bookmark.title}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
