import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  ChevronsUp,
  ChevronsDown,
  RotateCcw,
  PauseCircle,
  PlayCircle,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface Bookmark {
  title: string;
  url: string;
  group?: string;
}

interface BookmarkHologramProps {
  bookmarks: Bookmark[];
  showGroup?: boolean;
}

// 每个书签分组将形成一个独立的"环"
const BookmarkHologram: React.FC<BookmarkHologramProps> = ({
  bookmarks,
  showGroup = false
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBookmark, setHoveredBookmark] = useState<Bookmark | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [elevationAngle, setElevationAngle] = useState(20); // 整体倾斜角度
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // 将书签按分组整理
  const bookmarksByGroup: Record<string, Bookmark[]> = bookmarks.reduce(
    (acc, bookmark) => {
      const group = bookmark.group || '未分组';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(bookmark);
      return acc;
    },
    {} as Record<string, Bookmark[]>
  );

  // 获取所有唯一的分组
  const groups = Object.keys(bookmarksByGroup);

  // 处理点击书签事件
  const handleBookmarkClick = (url: string) => {
    window.open(url, '_blank');
  };

  // 根据分组生成颜色
  const getGroupColor = (group: string) => {
    let hash = 0;
    for (let i = 0; i < group.length; i++) {
      hash = group.charCodeAt(i) + ((hash << 5) - hash);
    }

    let r = (hash & 0xff0000) >> 16;
    let g = (hash & 0x00ff00) >> 8;
    let b = hash & 0x0000ff;

    // 增加亮度，确保颜色足够明亮
    r = Math.min(255, r + 100);
    g = Math.min(255, g + 100);
    b = Math.min(255, b + 100);

    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  };

  // 获取光晕颜色（基于分组颜色但透明度更低）
  const getGlowColor = (group: string) => {
    let hash = 0;
    for (let i = 0; i < group.length; i++) {
      hash = group.charCodeAt(i) + ((hash << 5) - hash);
    }

    let r = (hash & 0xff0000) >> 16;
    let g = (hash & 0x00ff00) >> 8;
    let b = hash & 0x0000ff;

    // 增加亮度，确保颜色足够明亮
    r = Math.min(255, r + 100);
    g = Math.min(255, g + 100);
    b = Math.min(255, b + 100);

    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  };

  return (
    <div className='relative h-[600px] w-full overflow-hidden'>
      {/* 控制面板 */}
      <div className='absolute top-0 right-0 z-50 flex flex-col gap-2 rounded-bl-lg bg-black/20 p-2 backdrop-blur-md'>
        <button
          className='bg-primary/20 hover:bg-primary/40 rounded-full p-2 transition-all'
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? '暂停旋转' : '开始旋转'}
        >
          {isRotating ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
        </button>
        <button
          className='bg-primary/20 hover:bg-primary/40 rounded-full p-2 transition-all'
          onClick={() => setElevationAngle((prev) => Math.min(prev + 5, 45))}
          title='增加倾斜角度'
        >
          <ChevronsUp size={16} />
        </button>
        <button
          className='bg-primary/20 hover:bg-primary/40 rounded-full p-2 transition-all'
          onClick={() => setElevationAngle((prev) => Math.max(prev - 5, 0))}
          title='减少倾斜角度'
        >
          <ChevronsDown size={16} />
        </button>
        <button
          className='bg-primary/20 hover:bg-primary/40 rounded-full p-2 transition-all'
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))}
          title='放大'
        >
          <ZoomIn size={16} />
        </button>
        <button
          className='bg-primary/20 hover:bg-primary/40 rounded-full p-2 transition-all'
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.6))}
          title='缩小'
        >
          <ZoomOut size={16} />
        </button>
        <button
          className='bg-primary/20 hover:bg-primary/40 rounded-full p-2 transition-all'
          onClick={() => {
            setElevationAngle(20);
            setZoomLevel(1);
            setIsRotating(true);
            setActiveGroup(null);
          }}
          title='重置视图'
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* 分组选择器 */}
      <div className='absolute top-0 left-0 z-40 flex max-w-[70%] flex-wrap gap-2 rounded-br-lg bg-black/20 p-2 backdrop-blur-md'>
        <button
          className={`rounded-full px-2 py-1 text-xs transition-all ${activeGroup === null ? 'bg-primary text-primary-foreground' : 'bg-primary/20 hover:bg-primary/40'}`}
          onClick={() => setActiveGroup(null)}
        >
          全部
        </button>
        {groups.map((group) => (
          <button
            key={group}
            className={`rounded-full px-2 py-1 text-xs transition-all ${activeGroup === group ? 'bg-primary text-primary-foreground' : 'bg-primary/20 hover:bg-primary/40'}`}
            onClick={() => setActiveGroup(activeGroup === group ? null : group)}
            style={{
              borderColor: getGroupColor(group),
              boxShadow:
                activeGroup === group
                  ? `0 0 10px ${getGlowColor(group)}`
                  : 'none'
            }}
          >
            {group}
          </button>
        ))}
      </div>

      {/* 主全息投影区域 */}
      <div
        ref={containerRef}
        className='hologram-container from-background/20 to-background perspective flex h-full w-full items-center justify-center bg-gradient-to-b'
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 全息基座 - 圆形底座 */}
        <div
          className='bg-primary/10 absolute bottom-0 h-[30px] w-[300px] rounded-full backdrop-blur-md'
          style={{
            boxShadow: `0 0 40px 10px ${theme === 'dark' ? 'rgba(64, 120, 255, 0.3)' : 'rgba(0, 60, 200, 0.15)'}`,
            transform: `scale(${zoomLevel})`
          }}
        />

        {/* 投影射线 - 从底座向上的光线 */}
        <div
          className='from-primary/80 absolute bottom-0 h-[80%] w-[2px] bg-gradient-to-t to-transparent'
          style={{
            left: 'calc(50% - 1px)',
            boxShadow: `0 0 15px 5px ${theme === 'dark' ? 'rgba(64, 120, 255, 0.2)' : 'rgba(0, 60, 200, 0.1)'}`,
            transform: `scale(${zoomLevel})`
          }}
        />

        {/* 3D全息投影主体 */}
        <motion.div
          className='hologram-projection relative'
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${elevationAngle}deg) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
          animate={isRotating ? { rotateY: [0, 360] } : {}}
          transition={
            isRotating ? { repeat: Infinity, duration: 40, ease: 'linear' } : {}
          }
        >
          {/* 渲染每个分组的环 */}
          {groups.map((group, groupIndex) => {
            // 如果选择了某个分组且不是当前分组，则不显示
            if (activeGroup !== null && activeGroup !== group) return null;

            const isCurrentGroupActive = activeGroup === group;
            const groupColor = getGroupColor(group);
            const glowColor = getGlowColor(group);
            const ringRadius = (groupIndex + 1) * 60; // 每个环的半径
            const ringItemCount = bookmarksByGroup[group].length;

            return (
              <motion.div
                key={group}
                className='bookmark-ring absolute'
                style={{
                  width: `${ringRadius * 2}px`,
                  height: `${ringRadius * 2}px`,
                  transformStyle: 'preserve-3d',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={
                  isCurrentGroupActive
                    ? { scale: [0.98, 1.02, 0.98], y: ['-50%', '-48%', '-50%'] }
                    : {}
                }
                transition={
                  isCurrentGroupActive
                    ? { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                    : {}
                }
              >
                {/* 环边框 */}
                <div
                  className='absolute h-full w-full rounded-full border-2 border-dashed opacity-40'
                  style={{
                    borderColor: groupColor,
                    boxShadow: `0 0 20px ${glowColor}, inset 0 0 10px ${glowColor}`,
                    transform: 'rotateX(90deg)'
                  }}
                />

                {/* 分组标题 - 悬浮在环的上方 */}
                <div
                  className='absolute text-sm font-bold whitespace-nowrap'
                  style={{
                    color: groupColor,
                    textShadow: `0 0 5px ${glowColor}`,
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none'
                  }}
                >
                  {group}
                </div>

                {/* 渲染环上的书签项 */}
                {bookmarksByGroup[group].map((bookmark, itemIndex) => {
                  const angle = (itemIndex / ringItemCount) * 360;
                  const radians = (angle * Math.PI) / 180;
                  const x = Math.cos(radians) * ringRadius;
                  const z = Math.sin(radians) * ringRadius;

                  const isHovered = hoveredBookmark === bookmark;

                  return (
                    <motion.div
                      key={bookmark.url}
                      className='bookmark-item absolute flex cursor-pointer items-center justify-center rounded-lg backdrop-blur-sm hover:z-50'
                      style={{
                        width: '40px',
                        height: '40px',
                        transformStyle: 'preserve-3d',
                        transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`,
                        backgroundColor: isHovered
                          ? `${groupColor.replace('0.8', '0.9')}`
                          : `${groupColor.replace('0.8', '0.5')}`,
                        boxShadow: isHovered
                          ? `0 0 15px 5px ${glowColor}, 0 0 5px 2px ${glowColor} inset`
                          : `0 0 10px ${glowColor}`,
                        border: isHovered ? `1px solid ${groupColor}` : 'none'
                      }}
                      onClick={() => handleBookmarkClick(bookmark.url)}
                      onMouseEnter={() => setHoveredBookmark(bookmark)}
                      onMouseLeave={() => setHoveredBookmark(null)}
                      whileHover={{ scale: 1.2, y: -10 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 15
                      }}
                    >
                      <div className='text-center text-xs font-bold text-white'>
                        {bookmark.title.substring(0, 2)}
                      </div>

                      {/* 悬停时显示的工具提示 */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className='bg-background/90 absolute top-full left-1/2 z-50 w-48 rounded-lg p-2 shadow-lg backdrop-blur-md'
                            style={{
                              transform: 'translateX(-50%) translateY(10px)',
                              border: `1px solid ${groupColor}`,
                              boxShadow: `0 0 10px ${glowColor}`
                            }}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className='mb-1 text-sm font-bold'>
                              {bookmark.title}
                            </div>
                            {showGroup && bookmark.group && (
                              <div className='text-muted-foreground mb-1 text-xs'>
                                {bookmark.group}
                              </div>
                            )}
                            <div className='text-primary truncate text-xs hover:text-clip'>
                              {bookmark.url}
                            </div>
                            <div className='bg-primary/20 hover:bg-primary/40 mt-2 rounded-sm py-1 text-center text-xs transition-colors'>
                              点击访问
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}

          {/* 中心核心 - 悬浮的能量球核心 */}
          <motion.div
            className='absolute rounded-full'
            style={{
              width: '40px',
              height: '40px',
              background: `radial-gradient(circle, rgba(64,120,255,0.8) 0%, rgba(24,80,215,0.5) 60%, rgba(0,40,175,0) 100%)`,
              boxShadow: '0 0 30px rgba(64, 120, 255, 0.8)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* 底部光晕 */}
        <div
          className='absolute bottom-0 h-[10px] w-[400px] rounded-full'
          style={{
            background: `radial-gradient(ellipse at center, ${theme === 'dark' ? 'rgba(64, 120, 255, 0.3)' : 'rgba(0, 60, 200, 0.15)'} 0%, transparent 70%)`,
            transform: `scale(${zoomLevel})`
          }}
        />
      </div>

      {/* 参考网格 - 可选，增加科幻感 */}
      <div
        className='pointer-events-none absolute bottom-0 left-0 h-[200px] w-full opacity-10'
        style={{
          background: `linear-gradient(transparent 95%, ${theme === 'dark' ? 'rgba(64, 120, 255, 0.5)' : 'rgba(0, 60, 200, 0.3)'} 100%), 
                      linear-gradient(90deg, transparent 95%, ${theme === 'dark' ? 'rgba(64, 120, 255, 0.5)' : 'rgba(0, 60, 200, 0.3)'} 100%)`,
          backgroundSize: '20px 20px',
          perspectiveOrigin: 'center bottom',
          transform: 'rotateX(60deg)',
          transformOrigin: 'bottom center'
        }}
      />
    </div>
  );
};

export default BookmarkHologram;
