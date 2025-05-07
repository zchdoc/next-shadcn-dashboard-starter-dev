import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BookmarkFlowProps {
  bookmarks: Array<{ title: string; url: string; group?: string }>;
  showGroup?: boolean;
}

export function BookmarkFlow({
  bookmarks,
  showGroup = false
}: BookmarkFlowProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  return (
    <div
      ref={flowRef}
      className='relative h-full min-h-[60vh] w-full overflow-hidden rounded-lg bg-black/5 p-8 backdrop-blur-sm dark:bg-white/5'
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-30 dark:from-white/5 dark:to-transparent'
        style={{
          transform: `rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`
        }}
      />

      <div className='relative z-10 h-full w-full'>
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
                <h3
                  className={`mb-4 text-base font-bold ${getColor(groupIndex)}`}
                >
                  {group}
                  <div className='mt-1 h-0.5 w-20 bg-current opacity-60' />
                </h3>
              )}

              <div className='flex flex-wrap gap-3'>
                {groupBookmarks.map((bookmark, index) => (
                  <motion.a
                    key={`${bookmark.group}-${bookmark.title}`}
                    href={bookmark.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='relative rounded-lg border border-white/10 bg-white/10 px-4 py-2 shadow-lg backdrop-blur-lg transition-all hover:border-white/30 dark:border-black/20 dark:bg-black/20 dark:hover:border-white/10'
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
                    <div className='flex items-center'>
                      <span className={`font-medium ${getColor(groupIndex)}`}>
                        {bookmark.title}
                      </span>
                      <span className='ml-2 text-xs opacity-50'>
                        {bookmark.url.replace(/^https?:\/\//, '').split('/')[0]}
                      </span>
                    </div>

                    {/* 发光效果 */}
                    <div
                      className={`pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r opacity-0 transition-opacity hover:opacity-30 ${getColor(groupIndex).replace('text-', 'from-').replace('-400', '-500')} to-transparent`}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
