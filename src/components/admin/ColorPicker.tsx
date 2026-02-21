import { useState } from 'react';
import { Paintbrush, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// ── Curated color presets ────────────────────────────────────────
const COLOR_PRESETS = [
    { label: 'Green', value: 'bg-green-500/20 text-green-700', preview: '#22c55e' },
    { label: 'Emerald', value: 'bg-emerald-500/20 text-emerald-700', preview: '#10b981' },
    { label: 'Teal', value: 'bg-teal-500/20 text-teal-700', preview: '#14b8a6' },
    { label: 'Cyan', value: 'bg-cyan-500/20 text-cyan-700', preview: '#06b6d4' },
    { label: 'Blue', value: 'bg-blue-500/20 text-blue-700', preview: '#3b82f6' },
    { label: 'Indigo', value: 'bg-indigo-500/20 text-indigo-700', preview: '#6366f1' },
    { label: 'Violet', value: 'bg-violet-500/20 text-violet-700', preview: '#8b5cf6' },
    { label: 'Purple', value: 'bg-purple-500/20 text-purple-700', preview: '#a855f7' },
    { label: 'Fuchsia', value: 'bg-fuchsia-500/20 text-fuchsia-700', preview: '#d946ef' },
    { label: 'Pink', value: 'bg-pink-500/20 text-pink-700', preview: '#ec4899' },
    { label: 'Rose', value: 'bg-rose-500/20 text-rose-700', preview: '#f43f5e' },
    { label: 'Red', value: 'bg-red-500/20 text-red-700', preview: '#ef4444' },
    { label: 'Orange', value: 'bg-orange-500/20 text-orange-700', preview: '#f97316' },
    { label: 'Amber', value: 'bg-amber-500/20 text-amber-700', preview: '#f59e0b' },
    { label: 'Yellow', value: 'bg-yellow-500/20 text-yellow-700', preview: '#eab308' },
    { label: 'Lime', value: 'bg-lime-500/20 text-lime-700', preview: '#84cc16' },
    { label: 'Stone', value: 'bg-stone-500/20 text-stone-700', preview: '#78716c' },
    { label: 'Slate', value: 'bg-slate-500/20 text-slate-700', preview: '#64748b' },
    { label: 'Zinc', value: 'bg-zinc-500/20 text-zinc-700', preview: '#71717a' },
    { label: 'Neutral', value: 'bg-neutral-500/20 text-neutral-700', preview: '#737373' },
];

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
    const [open, setOpen] = useState(false);
    const [customMode, setCustomMode] = useState(false);

    const selectedPreset = COLOR_PRESETS.find(p => p.value === value);

    return (
        <div className={className}>
            <Label className="text-xs font-medium text-muted-foreground">Color</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full mt-1 justify-start gap-2 h-9 font-normal"
                    >
                        {value ? (
                            <>
                                <div
                                    className="h-4 w-4 rounded-full border border-border/50 shrink-0"
                                    style={{ backgroundColor: selectedPreset?.preview || '#888' }}
                                />
                                <span className="truncate text-xs">
                                    {selectedPreset?.label || value}
                                </span>
                            </>
                        ) : (
                            <>
                                <Paintbrush className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground text-xs">Choose color...</span>
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Select Color</p>
                            {value && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-muted-foreground"
                                    onClick={() => { onChange(''); setOpen(false); }}
                                >
                                    <X className="h-3 w-3 mr-1" /> Clear
                                </Button>
                            )}
                        </div>

                        {/* Color Grid */}
                        <div className="grid grid-cols-5 gap-2">
                            {COLOR_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    className={cn(
                                        "group relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all hover:scale-105 hover:shadow-sm",
                                        value === preset.value
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "border-transparent hover:border-border"
                                    )}
                                    onClick={() => { onChange(preset.value); setOpen(false); }}
                                    title={preset.label}
                                >
                                    <div
                                        className="h-6 w-6 rounded-full border border-black/10 shadow-sm relative"
                                        style={{ backgroundColor: preset.preview }}
                                    >
                                        {value === preset.value && (
                                            <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow-sm" />
                                        )}
                                    </div>
                                    <span className="text-[9px] text-muted-foreground leading-none">
                                        {preset.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Input Toggle */}
                        <div className="border-t pt-2">
                            <button
                                type="button"
                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setCustomMode(!customMode)}
                            >
                                {customMode ? '← Back to presets' : '✏️ Custom CSS classes'}
                            </button>
                            {customMode && (
                                <div className="mt-2">
                                    <Input
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        placeholder="e.g., bg-green-500/20 text-green-700"
                                        className="text-xs h-8"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Enter Tailwind CSS classes for background and text color
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default ColorPicker;
