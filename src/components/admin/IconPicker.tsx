import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// ── Curated icon set (~80 most useful for CMS content) ───────────
const ICON_NAMES = [
    // General
    'Home', 'Star', 'Heart', 'Settings', 'Bell', 'Calendar', 'Clock', 'Eye',
    'Search', 'Filter', 'Bookmark', 'Flag', 'Award', 'Trophy', 'Crown', 'Gem',
    // Communication
    'Mail', 'Phone', 'MessageCircle', 'Send', 'Globe', 'Link', 'ExternalLink',
    // Business
    'Building2', 'Briefcase', 'DollarSign', 'CreditCard', 'Receipt',
    'BarChart3', 'TrendingUp', 'PieChart', 'Target',
    // Nature / Eco
    'Leaf', 'TreePine', 'Sprout', 'Sun', 'Cloud', 'Droplets', 'Recycle', 'Zap',
    // People
    'Users', 'User', 'UserCheck', 'HandHeart', 'Handshake', 'HeartHandshake',
    // Products / Shopping
    'ShoppingCart', 'Package', 'Box', 'Tag', 'Gift', 'Store', 'Truck',
    // Content / Media
    'FileText', 'Image', 'Camera', 'Video', 'Music', 'BookOpen', 'Newspaper',
    // Security / Trust
    'ShieldCheck', 'Shield', 'Lock', 'Key', 'BadgeCheck', 'CheckCircle',
    // Actions
    'Plus', 'Minus', 'ArrowRight', 'ArrowUp', 'Download', 'Upload', 'Share2',
    // Tools
    'Wrench', 'Cog', 'Hammer', 'Palette', 'Layers', 'Grid3X3', 'LayoutGrid',
    // Navigation
    'Map', 'MapPin', 'Compass', 'Navigation',
    // Misc
    'Lightbulb', 'Rocket', 'Sparkles', 'Flame', 'Coffee', 'ThumbsUp', 'Quote',
    'CircleDot', 'Info', 'HelpCircle', 'AlertCircle',
] as const;

type IconName = (typeof ICON_NAMES)[number];

// Build a map of name → component
const iconMap = new Map<string, React.FC<{ className?: string }>>();
ICON_NAMES.forEach(name => {
    const comp = (LucideIcons as Record<string, any>)[name];
    if (comp) iconMap.set(name, comp);
});

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const IconPicker = ({ value, onChange, className }: IconPickerProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = useMemo(() => {
        const q = search.toLowerCase();
        return Array.from(iconMap.entries()).filter(([name]) =>
            name.toLowerCase().includes(q)
        );
    }, [search]);

    const SelectedIcon = value ? iconMap.get(value) : null;

    return (
        <div className={className}>
            <Label className="text-xs font-medium text-muted-foreground">Icon</Label>
            <Button
                variant="outline"
                className="w-full mt-1 justify-start gap-2 h-9 font-normal"
                onClick={() => setOpen(true)}
                type="button"
            >
                {SelectedIcon ? (
                    <>
                        <SelectedIcon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-xs truncate">{value}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground text-xs">Choose icon...</span>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Select Icon</DialogTitle>
                    </DialogHeader>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search icons..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 h-9"
                            autoFocus
                        />
                        {search && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setSearch('')}
                            >
                                <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                        )}
                    </div>

                    {/* Selected indicator */}
                    {value && (
                        <div className="flex items-center justify-between px-2 py-1.5 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2">
                                {SelectedIcon && <SelectedIcon className="h-4 w-4 text-primary" />}
                                <span className="text-sm font-medium">{value}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => { onChange(''); setOpen(false); }}
                            >
                                <X className="h-3 w-3 mr-1" /> Clear
                            </Button>
                        </div>
                    )}

                    {/* Icon Grid */}
                    <ScrollArea className="h-[320px]">
                        <div className="grid grid-cols-8 gap-1 p-1">
                            {filteredIcons.map(([name, Icon]) => (
                                <button
                                    key={name}
                                    type="button"
                                    className={cn(
                                        "relative flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:bg-muted group",
                                        value === name
                                            ? "bg-primary/10 ring-1 ring-primary"
                                            : "hover:scale-105"
                                    )}
                                    onClick={() => { onChange(name); setOpen(false); }}
                                    title={name}
                                >
                                    <Icon className={cn(
                                        "h-5 w-5",
                                        value === name ? "text-primary" : "text-foreground/70 group-hover:text-foreground"
                                    )} />
                                    {value === name && (
                                        <Check className="absolute top-0.5 right-0.5 h-3 w-3 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {filteredIcons.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No icons match "{search}"
                            </div>
                        )}
                    </ScrollArea>

                    <p className="text-[10px] text-muted-foreground text-center">
                        {filteredIcons.length} icons available • Powered by Lucide Icons
                    </p>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IconPicker;
