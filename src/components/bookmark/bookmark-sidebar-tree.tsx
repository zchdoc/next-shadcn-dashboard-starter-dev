import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookmarkGroup {
  title: string;
  children?: Record<string, BookmarkGroup>;
  links: Array<{ title: string; url: string }>;
}

interface BookmarkSidebarTreeProps {
  bookmarkData: Record<string, BookmarkGroup>;
  selectedGroups: string[];
  onGroupChange: (value: string[]) => void;
}

interface TreeNodeProps {
  name: string;
  group: BookmarkGroup;
  path: string[];
  selectedGroups: string[];
  onSelect: (path: string[]) => void;
}

const TreeNode = ({
  name,
  group,
  path,
  selectedGroups,
  onSelect
}: TreeNodeProps) => {
  console.info('name:', name, 'path:', path, 'selectedGroups:', selectedGroups);
  // 下面代码会使树状结构折叠 如果想保持树状结构打开： const [isExpanded, setIsExpanded] = useState(selectedGroups.includes(name))
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedGroups.join('/') === path.join('/');

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect(path);
  };

  return (
    <div>
      <div
        className={cn(
          'hover:bg-accent flex cursor-pointer items-center rounded-md px-2 py-1',
          isSelected && 'bg-accent'
        )}
        onClick={handleSelect}
      >
        {group.children && Object.keys(group.children).length > 0 ? (
          <button
            onClick={handleToggle}
            className='hover:bg-accent mr-1 rounded-md p-1'
          >
            {isExpanded ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </button>
        ) : (
          <div className='w-6' />
        )}
        <span>{group.title}</span>
      </div>
      {isExpanded && group.children && (
        <div className='ml-4'>
          {Object.entries(group.children).map(([childName, childGroup]) => (
            <TreeNode
              key={childName}
              name={childName}
              group={childGroup}
              path={[...path, childName]}
              selectedGroups={selectedGroups}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function BookmarkSidebarTree({
  bookmarkData,
  selectedGroups,
  onGroupChange
}: BookmarkSidebarTreeProps) {
  return (
    <div className='h-[calc(100vh-13rem)] space-y-1 overflow-y-auto'>
      {Object.entries(bookmarkData).map(([name, group]) => (
        <TreeNode
          key={name}
          name={name}
          group={group}
          path={[name]}
          selectedGroups={selectedGroups}
          onSelect={onGroupChange}
        />
      ))}
    </div>
  );
}
