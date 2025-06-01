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
  ChevronsUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2
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
import { BookmarkData } from '@/constants/bookmarks-zch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { login, LoginParams } from '@/services/authService';
import { getBookmarks } from '@/services/bookmarkService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookmarkFromApiPage() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<
    'list' | 'card' | 'grid' | 'flow' | 'galaxy' | 'hologram' | 'card3d'
  >('list');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>(
    'center'
  );
  const [bookmarkData, setBookmarkData] = useState<BookmarkData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('123456');
  const [token, setToken] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

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

    const savedAlignment = localStorage.getItem('bookmarkListAlignment');
    if (
      savedAlignment &&
      ['left', 'center', 'right'].includes(savedAlignment)
    ) {
      setAlignment(savedAlignment as 'left' | 'center' | 'right');
    }

    // 从localStorage获取token
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      fetchBookmarks(savedToken);
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

  useEffect(() => {
    localStorage.setItem('bookmarkListAlignment', alignment);
  }, [alignment]);

  // 当token变化时获取书签数据
  useEffect(() => {
    if (token) {
      fetchBookmarks(token);
    }
  }, [token]);

  // 获取书签数据
  const fetchBookmarks = async (authToken: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await getBookmarks(authToken);
      setBookmarkData(data);

      // 如果没有选择的分组，或者选择的分组不在数据中，则选择所有分组
      if (
        selectedGroups.length === 0 ||
        !selectedGroups.every((group) => Object.keys(data).includes(group))
      ) {
        setSelectedGroups(Object.keys(data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取书签数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 登录并获取token
  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthError('');

      const loginParams: LoginParams = {
        username,
        password
      };

      const response = await login(loginParams);
      setToken(response.token);

      // 保存token到localStorage
      localStorage.setItem('authToken', response.token);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : '登录失败，请检查服务器连接'
      );
    } finally {
      setAuthLoading(false);
    }
  };

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

  const allSelectedBookmarks =
    bookmarkData &&
    selectedGroups.flatMap(
      (groupKey) =>
        bookmarkData[groupKey]?.links.map((link) => ({
          ...link,
          group: bookmarkData[groupKey].title
        })) || []
    );

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // 如果没有token，显示登录表单
  if (!token) {
    return (
      <div className='container mx-auto py-10'>
        <Card className='mx-auto max-w-md'>
          <CardHeader>
            <CardTitle>登录获取书签数据</CardTitle>
            <CardDescription>请先登录以从后端获取书签数据</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='username'>用户名</Label>
              <Input
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='请输入用户名'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>密码</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='请输入密码'
              />
            </div>

            {authError && (
              <Alert variant='destructive'>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleLogin}
              disabled={authLoading}
              className='w-full'
            >
              {authLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 如果正在加载书签数据
  if (loading || !bookmarkData) {
    return (
      <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto h-8 w-8 animate-spin' />
          <p className='text-muted-foreground mt-2 text-sm'>
            加载书签数据中...
          </p>
        </div>
      </div>
    );
  }

  // 如果加载出错
  if (error) {
    return (
      <div className='container mx-auto py-10'>
        <Alert variant='destructive' className='mx-auto max-w-md'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className='mt-4 flex justify-center'>
          <Button onClick={() => fetchBookmarks(token)}>重试</Button>
          <Button
            variant='outline'
            className='ml-2'
            onClick={() => {
              localStorage.removeItem('authToken');
              setToken('');
            }}
          >
            重新登录
          </Button>
        </div>
      </div>
    );
  }

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
                    {Object.entries(bookmarkData).map(([key, group]) => (
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
                          setSelectedGroups(Object.keys(bookmarkData));
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
                            const allKeys = Object.keys(bookmarkData);
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
                        <div key={groupKey} className='rounded-md border p-4'>
                          <h3 className='mb-2 font-medium'>
                            {bookmarkData[groupKey]?.title || groupKey}
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {bookmarkData[groupKey]?.links.map((link) => (
                              <a
                                key={link.title}
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-primary hover:text-primary/80 text-sm transition-colors hover:underline'
                              >
                                {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <div className='ml-auto flex items-center gap-2'>
                  <ToggleGroup
                    type='single'
                    value={alignment}
                    onValueChange={(value) => {
                      if (value)
                        setAlignment(value as 'left' | 'center' | 'right');
                    }}
                  >
                    <ToggleGroupItem value='left' aria-label='左对齐'>
                      <AlignLeft className='h-4 w-4' />
                    </ToggleGroupItem>
                    <ToggleGroupItem value='center' aria-label='居中对齐'>
                      <AlignCenter className='h-4 w-4' />
                    </ToggleGroupItem>
                    <ToggleGroupItem value='right' aria-label='右对齐'>
                      <AlignRight className='h-4 w-4' />
                    </ToggleGroupItem>
                  </ToggleGroup>

                  <Select
                    value={viewMode}
                    onValueChange={(value) =>
                      setViewMode(
                        value as
                          | 'list'
                          | 'card'
                          | 'grid'
                          | 'flow'
                          | 'galaxy'
                          | 'hologram'
                          | 'card3d'
                      )
                    }
                  >
                    <SelectTrigger className='w-[120px]'>
                      <SelectValue placeholder='选择视图' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='list'>列表视图</SelectItem>
                      <SelectItem value='card'>卡片视图</SelectItem>
                      <SelectItem value='grid'>网格视图</SelectItem>
                      <SelectItem value='flow'>流动视图</SelectItem>
                      <SelectItem value='galaxy'>星系视图</SelectItem>
                      <SelectItem value='hologram'>全息视图</SelectItem>
                      <SelectItem value='card3d'>3D卡片</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant='outline'
                    size='icon'
                    onClick={toggleViewMode}
                    className='ml-2'
                  >
                    {viewMode === 'list' && <ListIcon className='h-4 w-4' />}
                    {viewMode === 'card' && <LayoutGrid className='h-4 w-4' />}
                    {viewMode === 'grid' && <Grid3X3 className='h-4 w-4' />}
                    {viewMode === 'flow' && <Layers3 className='h-4 w-4' />}
                    {viewMode === 'galaxy' && (
                      <span className='text-xs'>🌌</span>
                    )}
                    {viewMode === 'hologram' && (
                      <span className='text-xs'>🔮</span>
                    )}
                    {viewMode === 'card3d' && (
                      <span className='text-xs'>🃏</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 书签内容区域 */}
          <div className='flex-grow'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className='h-full'
              >
                {isClient && allSelectedBookmarks && (
                  <>
                    {viewMode === 'list' && (
                      <BookmarkList
                        bookmarks={allSelectedBookmarks}
                        showGroup={true}
                        alignment={alignment}
                      />
                    )}
                    {viewMode === 'card' && (
                      <BookmarkGrid bookmarks={allSelectedBookmarks} />
                    )}
                    {viewMode === 'grid' && (
                      <BookmarkGrid
                        bookmarks={allSelectedBookmarks}
                        showGroup={true}
                      />
                    )}
                    {viewMode === 'flow' && (
                      <BookmarkFlow bookmarks={allSelectedBookmarks} />
                    )}
                    {viewMode === 'galaxy' && (
                      <BookmarkGalaxy bookmarks={allSelectedBookmarks} />
                    )}
                    {viewMode === 'hologram' && (
                      <BookmarkHologram bookmarks={allSelectedBookmarks} />
                    )}
                    {viewMode === 'card3d' && (
                      <BookmarkCard3D bookmarks={allSelectedBookmarks} />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className='fixed right-4 bottom-4 z-50'
          >
            <Button
              variant='outline'
              size='icon'
              className='rounded-full shadow-md'
              onClick={scrollToTop}
            >
              <ChevronsUp className='h-4 w-4' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
