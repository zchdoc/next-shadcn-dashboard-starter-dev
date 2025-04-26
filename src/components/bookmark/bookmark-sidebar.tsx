import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface BookmarkGroup {
  title: string;
  links: Array<{ title: string; url: string }>;
}

interface BookmarkSidebarProps {
  bookmarkData: Record<string, BookmarkGroup>;
  selectedGroup: string;
  onGroupChange: (value: string) => void;
}

export function BookmarkSidebar({
  bookmarkData,
  selectedGroup,
  onGroupChange
}: BookmarkSidebarProps) {
  return (
    // <div className="min-w-[240px] rounded-xl bg-card text-card-foreground shadow-lg">
    //   <div className="space-y-4 py-4">
    //     <div className="px-3 py-2">
    //       <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
    //         Bookmark Groups
    //       </h2>
    <Select value={selectedGroup} onValueChange={onGroupChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a group' />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(bookmarkData).map(([key, group]) => (
          <SelectItem key={key} value={key}>
            {group.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    //     </div>
    //   </div>
    // </div>
  );
}
