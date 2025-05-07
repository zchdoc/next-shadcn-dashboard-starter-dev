import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FolderOpen, FolderClosed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookmarkFlowProps {
  bookmarks: Array<{ title: string; url: string; group?: string }>;
  showGroup?: boolean;
}

export function BookmarkFlow({
  bookmarks,
  showGroup = false
}: BookmarkFlowProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const flowRef = useRef<HTMLDivElement>(null);

  // 处理鼠标移动，用于3D视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (flowRef.current) {
        const rect = flowRef.current.getBoundingClientRect();
        // 计算鼠标在容器内的相对位置
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    /* 
    // ===== 矩阵效果代码开始 =====
    // 如需恢复矩阵效果，取消注释此部分代码
    const canvas = document.createElement('canvas');
    const canvasContainer = document.getElementById('matrix-effect');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;

        // 矩阵效果的字符
        const matrix =
          'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const characters = matrix.split('');
        const fontSize = 10;
        const columns = canvas.width / fontSize;

        // 每一列的当前位置
        const drops: number[] = [];
        for (let i = 0; i < columns; i++) {
          drops[i] = Math.floor((Math.random() * canvas.height) / fontSize);
        }

        // 绘制矩阵效果
        const draw = () => {
          if (!ctx) return;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#0f0';
          ctx.font = fontSize + 'px monospace';

          for (let i = 0; i < drops.length; i++) {
            // 随机选择一个字符
            const text =
              characters[Math.floor(Math.random() * characters.length)];

            // x 坐标为当前列 * 字体大小
            // y 坐标为当前下降的位置 * 字体大小
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // 字符下降到底部或随机重置
            if (drops[i] * fontSize > canvas.height || Math.random() > 0.99) {
              drops[i] = 0;
            }

            // 移动到下一个位置
            drops[i]++;
          }
        };

        const matrixInterval = setInterval(draw, 30);

        // 清理函数
        return () => {
          clearInterval(matrixInterval);
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }
    // ===== 矩阵效果代码结束 =====
    */

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  // 初始化所有分组为展开状态
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    Object.keys(bookmarksByGroup).forEach((group) => {
      initialExpanded[group] = true;
    });
    setExpandedGroups(initialExpanded);
  }, []);

  // 为不同群组生成不同的颜色
  const getColor = (index: number) => {
    const colors = [
      'text-blue-400',
      'text-emerald-400',
      'text-purple-400',
      'text-orange-400',
      'text-pink-400',
      'text-cyan-400',
      'text-amber-400',
      'text-violet-400'
    ];
    return colors[index % colors.length];
  };

  // 切换分组展开/折叠
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // 展开所有分组
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(bookmarksByGroup).forEach((group) => {
      allExpanded[group] = true;
    });
    setExpandedGroups(allExpanded);
  };

  // 折叠所有分组
  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    Object.keys(bookmarksByGroup).forEach((group) => {
      allCollapsed[group] = false;
    });
    setExpandedGroups(allCollapsed);
  };

  // 检查是否所有分组都已展开或折叠
  const areAllExpanded = Object.values(expandedGroups).every(
    (value) => value === true
  );
  const areAllCollapsed = Object.values(expandedGroups).every(
    (value) => value === false
  );

  return (
    <div
      ref={flowRef}
      className='relative w-full rounded-lg bg-black/5 p-8 backdrop-blur-sm dark:bg-white/5'
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 矩阵效果 - 已注释禁用 */}
      {/* <div
        id='matrix-effect'
        className='pointer-events-none absolute inset-0 opacity-5'
      /> */}

      {/* 背景光效果 */}
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-30 dark:from-white/5 dark:to-transparent'
        style={{
          transform: `rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`
        }}
      />

      {/* 动态网格背景 */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          transform: `rotate(${mousePosition.x * 2}deg)`,
          opacity: 0.3,
          transition: 'transform 0.3s ease-out'
        }}
      />

      <div className='relative z-10'>
        {/* 全部展开/折叠控制按钮 */}
        {showGroup && (
          <div className='mb-6 flex justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              className={`text-xs ${areAllExpanded ? 'opacity-50' : ''}`}
              onClick={expandAll}
              disabled={areAllExpanded}
            >
              <FolderOpen className='mr-1 h-4 w-4' />
              展开全部
            </Button>
            <Button
              variant='outline'
              size='sm'
              className={`text-xs ${areAllCollapsed ? 'opacity-50' : ''}`}
              onClick={collapseAll}
              disabled={areAllCollapsed}
            >
              <FolderClosed className='mr-1 h-4 w-4' />
              折叠全部
            </Button>
          </div>
        )}

        {Object.entries(bookmarksByGroup).map(
          ([group, groupBookmarks], groupIndex) => (
            <motion.div
              key={group}
              className='relative mb-12'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
            >
              {showGroup && (
                <div className='mb-4 flex items-center'>
                  <motion.h3
                    className={`text-base font-bold ${getColor(groupIndex)} flex items-center`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* 分组标题点击切换展开/折叠 */}
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`mr-2 px-1 ${getColor(groupIndex)}`}
                      onClick={() => toggleGroup(group)}
                    >
                      {expandedGroups[group] ? (
                        <ChevronUp className='h-4 w-4' />
                      ) : (
                        <ChevronDown className='h-4 w-4' />
                      )}
                    </Button>
                    <span>{group}</span>
                    <motion.div
                      className='ml-2 h-0.5 w-20 bg-current opacity-60'
                      initial={{ width: 0 }}
                      animate={{ width: 80 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                    <span className='ml-3 text-xs opacity-70'>
                      ({groupBookmarks.length})
                    </span>
                  </motion.h3>
                </div>
              )}

              <AnimatePresence>
                {expandedGroups[group] && (
                  <motion.div
                    className='flex flex-wrap gap-3'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {groupBookmarks.map((bookmark, index) => (
                      <motion.a
                        key={`${bookmark.group}-${bookmark.title}`}
                        href={bookmark.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='relative rounded-lg border border-white/10 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-lg transition-all hover:border-white/30 dark:border-black/20 dark:bg-black/20 dark:hover:border-white/10'
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: `translate3d(${(index % 3) * 10}px, ${Math.floor(index / 3) * 5}px, ${index * 2}px)`,
                          zIndex: index
                        }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: groupIndex * 0.1 + index * 0.05
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                          zIndex: 50
                        }}
                      >
                        <div className='flex flex-col items-center'>
                          <span
                            className={`font-medium ${getColor(groupIndex)}`}
                          >
                            {bookmark.title}
                          </span>
                          <span className='mt-1 max-w-[150px] truncate text-xs opacity-50'>
                            {
                              bookmark.url
                                .replace(/^https?:\/\//, '')
                                .split('/')[0]
                            }
                          </span>
                        </div>

                        {/* 发光效果 */}
                        <div
                          className={`pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r opacity-0 transition-opacity hover:opacity-40 ${getColor(groupIndex).replace('text-', 'from-').replace('-400', '-500')} to-transparent`}
                        />
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
