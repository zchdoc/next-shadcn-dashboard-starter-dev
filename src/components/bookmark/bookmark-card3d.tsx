import React, { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ChevronRight } from 'lucide-react';

interface Bookmark {
  title: string;
  url: string;
  group?: string;
}

interface BookmarkCard3DProps {
  bookmarks: Bookmark[];
  showGroup?: boolean;
}

// 定义emoji数组，您可以随时添加或修改这个数组
const emojis = [
  '✨',
  '🚀',
  '💫',
  '🔖',
  '🌟',
  '📚',
  '🌈',
  '🎯',
  '🔗',
  '🌐',
  '💡',
  '🎨',
  '🎬',
  '🎮',
  '📱',
  '💻',
  '🤖',
  '👾',
  '🎵',
  '🎧',
  '📝',
  '📌',
  '🔍',
  '🌍',
  '💎',
  '🧩',
  '🔮',
  '🏆',
  '⭐',
  '🔥',
  '⚡',
  '🍀',
  '🦄',
  '🦋',
  '🌺',
  '🌴',
  '🚁',
  '🚗',
  '🛸',
  '🏡'
];

// 随机选择emoji的函数
const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

// 创建独立的卡片组件,每个卡片有自己的状态
const Card3D = ({
  bookmark,
  group,
  showGroup,
  groupColor
}: {
  bookmark: Bookmark;
  group: string;
  showGroup: boolean;
  groupColor: string;
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // 为每个卡片生成一个随机emoji并保持它的稳定性
  const cardEmoji = useMemo(() => getRandomEmoji(), []);

  // 每个卡片独立的鼠标追踪状态
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // 平滑旋转效果
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  // 光晕位置
  const glowX = useTransform(mouseX, [0, 1], ['-20%', '120%']);
  const glowY = useTransform(mouseY, [0, 1], ['-20%', '120%']);

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();

    // 计算鼠标在卡片上的相对位置 (0-1)
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;

    // 转换为旋转角度,中心点为0,边缘为最大值
    const rotateXValue = 10 * (0.5 - yPos); // 上下倾斜角度
    const rotateYValue = -15 * (0.5 - xPos); // 左右倾斜角度

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // 更新位置值,用于光晕效果
    mouseX.set(xPos);
    mouseY.set(yPos);
  };

  // 重置效果
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  // 点击卡片
  const handleClick = () => {
    window.open(bookmark.url, '_blank');
  };

  return (
    <motion.div
      className='relative h-[280px] cursor-pointer'
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
    >
      {/* 3D卡片 */}
      <motion.div
        className='h-full w-full overflow-hidden rounded-lg'
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 15px 30px rgba(0, 0, 0, 0.3)'
            : '0 10px 20px rgba(0, 0, 0, 0.2)',
          rotateX,
          rotateY
        }}
      >
        {/* 卡片主体 */}
        <div className='relative flex h-full w-full flex-col'>
          {/* 卡片顶部图片区域 - 虚化背景 */}
          <div
            className='relative h-[65%] w-full overflow-hidden'
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                  : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
          >
            {/* 光晕跟随鼠标移动 */}
            <motion.div
              className='pointer-events-none absolute h-40 w-40 rounded-full opacity-75'
              style={{
                background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)'} 0%, transparent 70%)`,
                left: glowX,
                top: glowY,
                transform: 'translate(-50%, -50%)',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s',
                filter: 'blur(8px)'
              }}
            />

            {/* 中心图标 */}
            <motion.div
              className='absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full'
              style={{
                background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'} 0%, transparent 70%)`,
                z: 50 // 突出显示
              }}
            >
              <div className='text-2xl font-bold' style={{ color: groupColor }}>
                {bookmark.title.charAt(0).toUpperCase()}
              </div>
            </motion.div>

            {/* 层级感装饰元素 */}
            <div
              className='absolute inset-0'
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 背景浮动装饰1 */}
              <motion.div
                className='absolute top-[15%] left-[20%] h-16 w-16 rounded-full opacity-30'
                style={{
                  background:
                    theme === 'dark'
                      ? 'rgba(100,150,255,0.1)'
                      : 'rgba(200,230,255,0.3)',
                  transform: 'translateZ(-20px)',
                  filter: 'blur(2px)'
                }}
              />

              {/* 背景浮动装饰2 */}
              <motion.div
                className='absolute right-[15%] bottom-[25%] h-12 w-12 rounded-full opacity-20'
                style={{
                  background:
                    theme === 'dark'
                      ? 'rgba(255,180,100,0.1)'
                      : 'rgba(255,220,180,0.3)',
                  transform: 'translateZ(-15px)',
                  filter: 'blur(2px)'
                }}
              />
            </div>
          </div>

          {/* 卡片底部信息区域 */}
          <div
            className='flex h-[35%] w-full flex-col justify-between p-4'
            style={{
              background: theme === 'dark' ? '#0f172a' : '#000000',
              color: '#ffffff',
              transformStyle: 'preserve-3d'
            }}
          >
            <div>
              <h3 className='mb-1 truncate text-lg font-bold'>
                {bookmark.title}
              </h3>
              <div className='flex items-center text-xs opacity-60'>
                {showGroup && bookmark.group ? (
                  <span className='mr-2'>{bookmark.group} ·</span>
                ) : null}
                <motion.span
                  className='inline-block text-2xl'
                  style={{
                    textShadow: '0 0 5px rgba(255,255,255,0.5)',
                    transform: 'translateZ(10px)'
                  }}
                  animate={
                    isHovered
                      ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0],
                          y: [0, -3, 0]
                        }
                      : {}
                  }
                  transition={
                    isHovered
                      ? {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }
                      : {}
                  }
                >
                  {cardEmoji}
                </motion.span>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <motion.span
                className='text-xs opacity-50'
                style={{ transform: 'translateZ(5px)' }}
              >
                {new Date().toLocaleDateString()}
              </motion.span>
              <motion.button
                className='flex items-center rounded-full px-3 py-1 text-xs'
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  opacity: isHovered ? 1 : 0.7,
                  transform: 'translateZ(20px)' // 按钮更突出
                }}
                whileHover={{ scale: 1.05 }}
              >
                了解更多 <ChevronRight size={12} className='ml-1' />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 底部阴影 - 增强3D效果 */}
      <motion.div
        className='absolute -bottom-4 left-[10%] h-4 w-[80%] rounded-full opacity-30'
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%)',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center top',
          filter: 'blur(3px)',
          // 阴影随卡片倾斜而移动
          x: useTransform(rotateY, [-15, 15], [-10, 10]),
          width: useTransform(rotateY, [-15, 15], ['90%', '70%'])
        }}
      />
    </motion.div>
  );
};

const BookmarkCard3D: React.FC<BookmarkCard3DProps> = ({
  bookmarks,
  showGroup = false
}) => {
  const { theme } = useTheme();

  // 根据分组对书签进行分类
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

  // 根据分组生成颜色
  const getGroupColor = (group: string) => {
    let hash = 0;
    for (let i = 0; i < group.length; i++) {
      hash = group.charCodeAt(i) + ((hash << 5) - hash);
    }

    let r = (hash & 0xff0000) >> 16;
    let g = (hash & 0x00ff00) >> 8;
    let b = hash & 0x0000ff;

    // 增加亮度,确保颜色足够明亮
    r = Math.min(255, r + 100);
    g = Math.min(255, g + 100);
    b = Math.min(255, b + 100);

    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  };

  return (
    <div className='w-full p-6'>
      {Object.entries(bookmarksByGroup).map(([group, groupBookmarks]) => (
        <div key={group} className='mb-12'>
          <h3 className='mb-6 text-xl font-semibold'>{group}</h3>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {groupBookmarks.map((bookmark) => (
              <Card3D
                key={bookmark.url}
                bookmark={bookmark}
                group={group}
                showGroup={showGroup}
                groupColor={getGroupColor(group)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarkCard3D;
