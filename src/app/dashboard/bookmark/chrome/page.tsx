'use client';
import { useState, useEffect, useRef } from 'react';
import { BookmarkContent } from '@/components/bookmark/bookmark-content';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { BookmarkGrid } from '@/components/bookmark/bookmark-grid';
import { BookmarkFlow } from '@/components/bookmark/bookmark-flow';
import BookmarkGalaxy from '@/components/bookmark/bookmark-galaxy';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  LayoutGrid,
  ListIcon,
  Grid3X3,
  Layers3,
  ChevronsUp
} from 'lucide-react';
import BookmarkHologram from '@/components/bookmark/bookmark-hologram';
import BookmarkCard3D from '@/components/bookmark/bookmark-card3d';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { bookmarkDataZch, BookmarkData } from '@/constants/bookmarks-zch';

export default function BookmarkPage() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    Object.keys(bookmarkDataZch)
  );
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<
    'list' | 'card' | 'grid' | 'flow' | 'galaxy' | 'hologram' | 'card3d'
  >('list');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('bookmarkSelectedGroups');
    if (saved) {
      setSelectedGroups(JSON.parse(saved));
    }

    const savedViewMode = localStorage.getItem('bookmarkViewMode');
    if (
      savedViewMode &&
      ['list', 'card', 'grid', 'flow', 'galaxy', 'hologram', 'card3d'].includes(
        savedViewMode
      )
    ) {
      setViewMode(
        savedViewMode as
          | 'list'
          | 'card'
          | 'grid'
          | 'flow'
          | 'galaxy'
          | 'hologram'
          | 'card3d'
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setShowScrollTop(containerRef.current.scrollTop > 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const saveSelection = () => {
    localStorage.setItem(
      'bookmarkSelectedGroups',
      JSON.stringify(selectedGroups)
    );
  };

  const toggleViewMode = () => {
    const modes: (
      | 'list'
      | 'card'
      | 'grid'
      | 'flow'
      | 'galaxy'
      | 'hologram'
      | 'card3d'
    )[] = ['list', 'card', 'grid', 'flow', 'galaxy', 'hologram', 'card3d'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const newMode = modes[nextIndex];
    setViewMode(newMode);
    localStorage.setItem('bookmarkViewMode', newMode);
  };

  const allSelectedBookmarks = selectedGroups.flatMap((groupKey) =>
    bookmarkDataZch[groupKey].links.map((link) => ({
      ...link,
      group: bookmarkDataZch[groupKey].title
    }))
  );

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={containerRef} className='h-[calc(100dvh-52px)] overflow-auto'>
      <div className='flex flex-1 p-4 md:px-6'>
        <div className='flex w-full flex-col'>
          {/* 顶部区域 */}
          <div className='flex-none py-4'>
            <div className='flex items-center gap-4'>
              {/* 选择分组 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline'>选择分组</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  <div className='grid gap-2 p-2'>
                    {Object.entries(bookmarkDataZch).map(([key, group]) => (
                      <div key={key} className='flex items-center space-x-2'>
                        <Checkbox
                          id={key}
                          checked={selectedGroups.includes(key)}
                          onCheckedChange={(checked) => {
                            setSelectedGroups((prev) =>
                              checked
                                ? [...prev, key]
                                : prev.filter((g) => g !== key)
                            );
                          }}
                        />
                        <label
                          htmlFor={key}
                          className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {group.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className='grid gap-2 border-t p-2'>
                    <div className='flex gap-2'>
                      <Button
                        className='flex-1'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedGroups(Object.keys(bookmarkDataZch));
                        }}
                      >
                        全选
                      </Button>
                      <Button
                        className='flex-1'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedGroups([]);
                        }}
                      >
                        清空
                      </Button>
                      <Button
                        className='flex-1'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedGroups((prev) => {
                            const allKeys = Object.keys(bookmarkDataZch);
                            return allKeys.filter((key) => !prev.includes(key));
                          });
                        }}
                      >
                        反选
                      </Button>
                    </div>
                    <Button
                      className='w-full'
                      variant='outline'
                      onClick={saveSelection}
                    >
                      保存选择
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className='flex flex-1 items-center gap-4'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>已选分组</Button>
                  </DialogTrigger>
                  <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
                    <DialogHeader>
                      <DialogTitle>已选择的分组</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      {selectedGroups.map((groupKey) => (
                        <div key={groupKey} className='space-y-2'>
                          <h3 className='font-semibold'>
                            {bookmarkDataZch[groupKey].title}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                {/* 查看已选择分组内容 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>已选内容</Button>
                  </DialogTrigger>
                  <DialogContent className='max-h-[80vh] max-w-3xl overflow-y-auto'>
                    <DialogHeader>
                      <DialogTitle>已选择的书签列表内容</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      {selectedGroups.map((groupKey) => (
                        <div key={groupKey} className='space-y-2'>
                          <h3 className='font-semibold'>
                            {bookmarkDataZch[groupKey].title}
                          </h3>
                          {bookmarkDataZch[groupKey].links.map(
                            (link, index) => (
                              <div
                                key={`${link.title}-${link.url}`}
                                className='ml-4 flex items-center gap-4'
                              >
                                <div className='font-medium'>{link.title}</div>
                                <div className='text-muted-foreground text-sm'>
                                  {link.url}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* 视图切换控件组 */}
                <div className='ml-auto flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={toggleViewMode}
                    className='flex items-center gap-2'
                    title={
                      viewMode === 'list'
                        ? '切换到卡片视图'
                        : viewMode === 'card'
                          ? '切换到网格视图'
                          : viewMode === 'grid'
                            ? '切换到3D流视图'
                            : viewMode === 'flow'
                              ? '切换到星系视图'
                              : viewMode === 'galaxy'
                                ? '切换到全息视图'
                                : viewMode === 'hologram'
                                  ? '切换到3D卡片视图'
                                  : '切换到列表视图'
                    }
                  >
                    {viewMode === 'list' ? (
                      <LayoutGrid className='h-4 w-4' />
                    ) : viewMode === 'card' ? (
                      <Grid3X3 className='h-4 w-4' />
                    ) : viewMode === 'grid' ? (
                      <Layers3 className='h-4 w-4' />
                    ) : viewMode === 'flow' ? (
                      <ListIcon className='h-4 w-4' />
                    ) : viewMode === 'galaxy' ? (
                      <ListIcon className='h-4 w-4' />
                    ) : viewMode === 'hologram' ? (
                      <ListIcon className='h-4 w-4' />
                    ) : (
                      <ListIcon className='h-4 w-4' />
                    )}
                    <span className='text-xs'>
                      {viewMode === 'list'
                        ? '列表视图'
                        : viewMode === 'card'
                          ? '卡片视图'
                          : viewMode === 'grid'
                            ? '网格视图'
                            : viewMode === 'flow'
                              ? '3D流视图'
                              : viewMode === 'galaxy'
                                ? '星系视图'
                                : viewMode === 'hologram'
                                  ? '全息视图'
                                  : '3D卡片视图'}
                    </span>
                  </Button>

                  <Select
                    value={viewMode}
                    onValueChange={(
                      value:
                        | 'list'
                        | 'card'
                        | 'grid'
                        | 'flow'
                        | 'galaxy'
                        | 'hologram'
                        | 'card3d'
                    ) => {
                      setViewMode(value);
                      localStorage.setItem('bookmarkViewMode', value);
                    }}
                  >
                    <SelectTrigger className='h-8 w-[120px]'>
                      <SelectValue placeholder='选择视图' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='list'>列表视图</SelectItem>
                      <SelectItem value='card'>卡片视图</SelectItem>
                      <SelectItem value='grid'>网格视图</SelectItem>
                      <SelectItem value='flow'>3D流视图</SelectItem>
                      <SelectItem value='galaxy'>星系视图</SelectItem>
                      <SelectItem value='hologram'>全息视图</SelectItem>
                      <SelectItem value='card3d'>3D卡片视图</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          {/* 主要内容区域 */}
          <div className='flex-1 pb-6'>
            {isClient ? (
              <div
                className={`bg-card rounded-lg border shadow-sm ${
                  viewMode === 'flow' ? 'p-0' : 'p-4'
                }`}
              >
                {viewMode !== 'flow' && (
                  <div className='mb-3 flex items-center justify-between border-b pb-2'>
                    <h2 className='font-medium'>我的书签</h2>
                    <p className='text-muted-foreground text-xs'>
                      共 {allSelectedBookmarks.length} 个书签，来自{' '}
                      {selectedGroups.length} 个分组
                    </p>
                  </div>
                )}
                {viewMode === 'list' ? (
                  <BookmarkList
                    bookmarks={allSelectedBookmarks}
                    showGroup={true}
                    alignment='center'
                  />
                ) : viewMode === 'card' ? (
                  <BookmarkContent
                    bookmarks={allSelectedBookmarks}
                    groupTitle=''
                    cardsPerRow={6}
                    showGroup={true}
                    settingsKey={'zch-bookmark'}
                  />
                ) : viewMode === 'grid' ? (
                  <BookmarkGrid
                    bookmarks={allSelectedBookmarks}
                    showGroup={true}
                  />
                ) : viewMode === 'flow' ? (
                  <BookmarkFlow
                    bookmarks={allSelectedBookmarks}
                    showGroup={true}
                  />
                ) : viewMode === 'galaxy' ? (
                  <BookmarkGalaxy
                    bookmarks={allSelectedBookmarks}
                    showGroup={true}
                  />
                ) : viewMode === 'hologram' ? (
                  <BookmarkHologram
                    bookmarks={allSelectedBookmarks}
                    showGroup={true}
                  />
                ) : (
                  <BookmarkCard3D
                    bookmarks={allSelectedBookmarks}
                    showGroup={true}
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className='fixed right-8 bottom-8 z-50'
            onClick={scrollToTop}
          >
            <Button
              className='bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary border-primary-foreground/20 relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 p-0 shadow-lg'
              aria-label='回到顶部'
              title='回到顶部'
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <ChevronsUp className='text-primary-foreground h-7 w-7' />
              </motion.div>
            </Button>
            <motion.div
              className='bg-primary/20 pointer-events-none absolute inset-0 rounded-full blur-sm'
              animate={{
                scale: [0.85, 1.05, 0.85],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
