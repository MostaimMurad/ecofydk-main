import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center rounded-md border border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewChange('grid')}
        className={cn(
          'h-9 w-9 rounded-none rounded-l-md',
          viewMode === 'grid' && 'bg-muted'
        )}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewChange('list')}
        className={cn(
          'h-9 w-9 rounded-none rounded-r-md border-l border-border',
          viewMode === 'list' && 'bg-muted'
        )}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
