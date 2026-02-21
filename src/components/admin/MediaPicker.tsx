import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Search, Upload, Image as ImageIcon, Film, FileText,
    FolderOpen, Check,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────
interface MediaAsset {
    id: string;
    file_name: string;
    original_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    alt_text: string;
    folder: string;
    created_at: string;
}

interface MediaPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (url: string, alt?: string) => void;
    accept?: 'image' | 'video' | 'all';
}

const FOLDERS = ['general', 'products', 'hero', 'blog', 'team', 'partners', 'icons'];

function getPublicUrl(path: string) {
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ── Component ────────────────────────────────────────────────────────
export default function MediaPicker({ open, onClose, onSelect, accept = 'image' }: MediaPickerProps) {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [folder, setFolder] = useState<string>('all');
    const [selected, setSelected] = useState<MediaAsset | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: assets, isLoading, refetch } = useQuery({
        queryKey: ['media-picker-assets', folder],
        queryFn: async () => {
            let query = (supabase as any)
                .from('media_assets')
                .select('*')
                .order('created_at', { ascending: false });

            if (folder !== 'all') query = query.eq('folder', folder);

            if (accept === 'image') {
                query = query.like('mime_type', 'image/%');
            } else if (accept === 'video') {
                query = query.like('mime_type', 'video/%');
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as MediaAsset[];
        },
        enabled: open,
    });

    const filtered = assets?.filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return a.original_name.toLowerCase().includes(q) || a.alt_text?.toLowerCase().includes(q);
    });

    const handleUpload = useCallback(async (files: FileList) => {
        setIsUploading(true);
        const file = files[0];
        if (!file) return;

        const ext = file.name.split('.').pop() ?? '';
        const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const targetFolder = folder === 'all' ? 'general' : folder;
        const storagePath = `${targetFolder}/${uniqueName}`;

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) {
            toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
            setIsUploading(false);
            return;
        }

        await (supabase as any).from('media_assets').insert({
            file_name: uniqueName,
            original_name: file.name,
            file_path: storagePath,
            file_size: file.size,
            mime_type: file.type || 'application/octet-stream',
            folder: targetFolder,
        });

        toast({ title: 'File uploaded' });
        refetch();
        setIsUploading(false);
    }, [folder, toast, refetch]);

    const handleSelect = () => {
        if (!selected) return;
        const url = getPublicUrl(selected.file_path);
        onSelect(url, selected.alt_text);
        setSelected(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" /> Select Media
                    </DialogTitle>
                </DialogHeader>

                {/* Top bar */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <label>
                        <Button variant="outline" asChild disabled={isUploading}>
                            <span>
                                <Upload className="mr-2 h-4 w-4" />
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </span>
                        </Button>
                        <input
                            type="file"
                            className="hidden"
                            accept={accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : '*/*'}
                            onChange={(e) => e.target.files && handleUpload(e.target.files)}
                        />
                    </label>
                </div>

                {/* Folder tabs */}
                <div className="flex gap-1.5 flex-wrap">
                    <button
                        onClick={() => setFolder('all')}
                        className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                            folder === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                    >
                        All
                    </button>
                    {FOLDERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFolder(f)}
                            className={cn(
                                'px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors',
                                folder === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <div className="grid grid-cols-4 gap-3 p-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <Skeleton key={i} className="aspect-square rounded-lg" />
                            ))}
                        </div>
                    ) : !filtered?.length ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <ImageIcon className="h-10 w-10 mb-3 opacity-30" />
                            <p className="text-sm">No media files found</p>
                            <p className="text-xs mt-1">Upload a file or change filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1">
                            {filtered.map((asset) => (
                                <button
                                    key={asset.id}
                                    onClick={() => setSelected(asset)}
                                    className={cn(
                                        'relative rounded-lg overflow-hidden border bg-card transition-all hover:ring-2 hover:ring-primary/30 aspect-square',
                                        selected?.id === asset.id && 'ring-2 ring-primary'
                                    )}
                                >
                                    {asset.mime_type.startsWith('image/') ? (
                                        <img
                                            src={getPublicUrl(asset.file_path)}
                                            alt={asset.alt_text || asset.original_name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full h-full bg-muted">
                                            {asset.mime_type.startsWith('video/') ? (
                                                <Film className="h-8 w-8 text-muted-foreground/50" />
                                            ) : (
                                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                                            )}
                                            <span className="text-[10px] text-muted-foreground mt-1 px-1 truncate w-full text-center">
                                                {asset.original_name}
                                            </span>
                                        </div>
                                    )}
                                    {selected?.id === asset.id && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <div className="bg-primary rounded-full p-1">
                                                <Check className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                                        <p className="text-[10px] text-white truncate">{asset.original_name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-3">
                    <div className="text-xs text-muted-foreground">
                        {selected && (
                            <>
                                <span className="font-medium">{selected.original_name}</span>
                                <span className="mx-1.5">·</span>
                                <span>{formatBytes(selected.file_size)}</span>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSelect} disabled={!selected}>
                            <Check className="mr-2 h-4 w-4" /> Select
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
