import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface BookmarkGridProps {
  bookmarks: Array<{ title: string; url: string; group?: string }>;
  showGroup?: boolean;
}

export function BookmarkGrid({
  bookmarks,
  showGroup = false
}: BookmarkGridProps) {
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

  // 为不同群组生成不同的渐变颜色
  const getGradient = (index: number) => {
    const gradients = [
      'from-blue-500/20 to-purple-500/20',
      'from-emerald-500/20 to-cyan-500/20',
      'from-orange-500/20 to-red-500/20',
      'from-pink-500/20 to-violet-500/20',
      'from-indigo-500/20 to-sky-500/20',
      'from-amber-500/20 to-yellow-500/20',
      'from-rose-500/20 to-fuchsia-500/20',
      'from-lime-500/20 to-green-500/20'
    ];
    return gradients[index % gradients.length];
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }
  };

  return (
    <div className='space-y-8'>
      {Object.entries(bookmarksByGroup).map(
        ([group, groupBookmarks], groupIndex) => (
          <div key={group} className='space-y-3'>
            {showGroup && (
              <h3 className='mb-3 flex items-center text-sm font-semibold'>
                <span
                  className={`h-2 w-2 rounded-full bg-gradient-to-r ${getGradient(groupIndex)} mr-2`}
                ></span>
                {group}
              </h3>
            )}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
              {groupBookmarks.map((bookmark, index) => (
                <motion.a
                  key={`${bookmark.group}-${bookmark.title}`}
                  href={bookmark.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`bg-gradient-to-r text-center ${getGradient(groupIndex)} hover:border-primary/20 flex h-24 flex-col items-center justify-center rounded-xl border border-transparent p-4 backdrop-blur-sm transition-all`}
                  title={bookmark.url}
                  variants={cardVariants}
                  initial='initial'
                  animate='animate'
                  whileHover='hover'
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <span className='text-primary font-medium'>
                    {bookmark.title}
                  </span>
                  <span className='mt-1 w-full truncate text-xs text-gray-500'>
                    {bookmark.url.replace(/^https?:\/\//, '').split('/')[0]}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
