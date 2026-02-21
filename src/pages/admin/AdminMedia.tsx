import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Upload, Search, Grid3X3, List, Trash2, Copy, Image as ImageIcon,
    FileText, Film, FolderOpen, X, Check, Download, ExternalLink,
    MoreHorizontal, Tag, Info,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Types ───────────────────────────────────────────────────────────
interface MediaAsset {
    id: string;
    file_name: string;
    original_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    width: number | null;
    height: number | null;
    alt_text: string;
    caption: string;
    tags: string[];
    folder: string;
    uploaded_by: string | null;
    created_at: string;
    updated_at: string;
}

const FOLDERS = ['general', 'products', 'hero', 'blog', 'team', 'partners', 'icons'];

// ── Helpers ─────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mime: string) {
    if (mime.startsWith('image/')) return ImageIcon;
    if (mime.startsWith('video/')) return Film;
    return FileText;
}

function getPublicUrl(path: string) {
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
}

function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ── Component ───────────────────────────────────────────────────────
const AdminMedia = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [folder, setFolder] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // ── Fetch assets ──────────────────────────────────────────────────
    const { data: assets, isLoading } = useQuery({
        queryKey: ['media-assets', folder],
        queryFn: async () => {
            let query = (supabase as any)
                .from('media_assets')
                .select('*')
                .order('created_at', { ascending: false });

            if (folder !== 'all') {
                query = query.eq('folder', folder);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as MediaAsset[];
        },
    });

    // Filtered list
    const filtered = assets?.filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            a.original_name.toLowerCase().includes(q) ||
            a.alt_text?.toLowerCase().includes(q) ||
            a.tags?.some(t => t.toLowerCase().includes(q))
        );
    });

    // ── Upload ────────────────────────────────────────────────────────
    const handleUpload = useCallback(async (files: FileList | File[]) => {
        setIsUploading(true);
        const fileArray = Array.from(files);
        let successCount = 0;

        for (const file of fileArray) {
            const ext = file.name.split('.').pop() ?? '';
            const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const targetFolder = folder === 'all' ? 'general' : folder;
            const storagePath = `${targetFolder}/${uniqueName}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(storagePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) {
                toast({
                    title: `Failed to upload "${file.name}"`,
                    description: uploadError.message,
                    variant: 'destructive',
                });
                continue;
            }

            // Get dimensions for images
            let width: number | null = null;
            let height: number | null = null;
            if (file.type.startsWith('image/')) {
                try {
                    const dimensions = await getImageDimensions(file);
                    width = dimensions.width;
                    height = dimensions.height;
                } catch { /* ignore */ }
            }

            // Insert metadata
            const { error: insertError } = await (supabase as any).from('media_assets').insert({
                file_name: uniqueName,
                original_name: file.name,
                file_path: storagePath,
                file_size: file.size,
                mime_type: file.type || 'application/octet-stream',
                width,
                height,
                folder: targetFolder,
            });

            if (insertError) {
                toast({
                    title: `Metadata error for "${file.name}"`,
                    description: insertError.message,
                    variant: 'destructive',
                });
            } else {
                successCount++;
            }
        }

        if (successCount > 0) {
            toast({ title: `${successCount} file${successCount > 1 ? 's' : ''} uploaded` });
            queryClient.invalidateQueries({ queryKey: ['media-assets'] });
        }

        setIsUploading(false);
    }, [folder, toast, queryClient]);

    // ── Delete ────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (asset: MediaAsset) => {
            const { error: storageErr } = await supabase.storage
                .from('media')
                .remove([asset.file_path]);
            if (storageErr) throw storageErr;

            const { error: dbErr } = await (supabase as any)
                .from('media_assets')
                .delete()
                .eq('id', asset.id);
            if (dbErr) throw dbErr;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media-assets'] });
            toast({ title: 'File deleted' });
            setDeleteTarget(null);
            if (selectedAsset?.id === deleteTarget?.id) {
                setSelectedAsset(null);
                setDetailOpen(false);
            }
        },
        onError: (err: any) => {
            toast({
                title: 'Delete failed',
                description: err.message,
                variant: 'destructive',
            });
        },
    });

    // ── Update metadata ───────────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: async (asset: Partial<MediaAsset> & { id: string }) => {
            const { error } = await (supabase as any)
                .from('media_assets')
                .update({
                    alt_text: asset.alt_text,
                    caption: asset.caption,
                    folder: asset.folder,
                    tags: asset.tags,
                })
                .eq('id', asset.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media-assets'] });
            toast({ title: 'Details saved' });
        },
    });

    // ── Drag & Drop ───────────────────────────────────────────────────
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard' });
    };

    // ── Folder counts ─────────────────────────────────────────────────
    const folderCounts: Record<string, number> = {};
    assets?.forEach(a => {
        folderCounts[a.folder] = (folderCounts[a.folder] || 0) + 1;
    });

    return (
        <div
            className="space-y-6"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
        >
            {/* Drag overlay */}
            <AnimatePresence>
                {dragActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="bg-background border-2 border-dashed border-primary rounded-xl p-12 text-center">
                            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                            <p className="text-lg font-semibold">Drop files to upload</p>
                            <p className="text-sm text-muted-foreground">
                                Images, PDFs, and videos up to 10MB
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-primary" />
                        Media Library
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {assets?.length ?? 0} files · {formatBytes(assets?.reduce((s, a) => s + a.file_size, 0) ?? 0)} total
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <label>
                        <Button asChild disabled={isUploading}>
                            <span>
                                <Upload className="mr-2 h-4 w-4" />
                                {isUploading ? 'Uploading...' : 'Upload Files'}
                            </span>
                        </Button>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => e.target.files && handleUpload(e.target.files)}
                            accept="image/*,application/pdf,video/mp4"
                        />
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Folder sidebar */}
                <Card className="lg:w-56 shrink-0">
                    <CardContent className="p-3 space-y-0.5">
                        <h3 className="font-semibold text-xs text-muted-foreground uppercase px-2 py-1.5 tracking-wider">
                            Folders
                        </h3>
                        <button
                            onClick={() => setFolder('all')}
                            className={cn(
                                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                                folder === 'all'
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-muted text-muted-foreground'
                            )}
                        >
                            <FolderOpen className="h-4 w-4" /> All Files
                            <Badge variant="secondary" className="ml-auto text-xs">
                                {assets?.length ?? 0}
                            </Badge>
                        </button>
                        {FOLDERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFolder(f)}
                                className={cn(
                                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm capitalize transition-colors',
                                    folder === f
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'hover:bg-muted text-muted-foreground'
                                )}
                            >
                                <FolderOpen className="h-4 w-4" /> {f}
                                {folderCounts[f] ? (
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        {folderCounts[f]}
                                    </Badge>
                                ) : null}
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Main content area */}
                <div className="flex-1 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by filename, alt text, or tag..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Grid / List */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <Skeleton key={i} className="aspect-square rounded-xl" />
                            ))}
                        </div>
                    ) : !filtered?.length ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
                                <p className="text-lg font-medium">No media found</p>
                                <p className="text-sm">Upload files or change filters</p>
                            </CardContent>
                        </Card>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filtered.map((asset) => (
                                <motion.div
                                    key={asset.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        'group relative rounded-xl overflow-hidden border bg-card cursor-pointer transition-all hover:ring-2 hover:ring-primary/30',
                                        selectedAsset?.id === asset.id && 'ring-2 ring-primary'
                                    )}
                                    onClick={() => {
                                        setSelectedAsset(asset);
                                        setDetailOpen(true);
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-square bg-muted relative">
                                        {asset.mime_type.startsWith('image/') ? (
                                            <img
                                                src={getPublicUrl(asset.file_path)}
                                                alt={asset.alt_text || asset.original_name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full">
                                                {(() => {
                                                    const Icon = getFileIcon(asset.mime_type);
                                                    return <Icon className="h-10 w-10 text-muted-foreground/50" />;
                                                })()}
                                            </div>
                                        )}
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-1.5">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(getPublicUrl(asset.file_path));
                                                    }}
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteTarget(asset);
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-2.5">
                                        <p className="text-xs font-medium truncate">{asset.original_name}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {formatBytes(asset.file_size)} · {timeAgo(asset.created_at)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* List view */
                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground w-12"></th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Size</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Folder</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Uploaded</th>
                                            <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((asset) => (
                                            <tr
                                                key={asset.id}
                                                className="border-b hover:bg-muted/30 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedAsset(asset);
                                                    setDetailOpen(true);
                                                }}
                                            >
                                                <td className="px-4 py-2.5">
                                                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                                                        {asset.mime_type.startsWith('image/') ? (
                                                            <img
                                                                src={getPublicUrl(asset.file_path)}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full">
                                                                {(() => {
                                                                    const Icon = getFileIcon(asset.mime_type);
                                                                    return <Icon className="h-5 w-5 text-muted-foreground/50" />;
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <span className="text-sm font-medium">{asset.original_name}</span>
                                                </td>
                                                <td className="px-4 py-2.5 text-sm text-muted-foreground">
                                                    {formatBytes(asset.file_size)}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <Badge variant="outline" className="text-xs">
                                                        {asset.mime_type.split('/')[1]}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-2.5 text-sm text-muted-foreground capitalize">
                                                    {asset.folder}
                                                </td>
                                                <td className="px-4 py-2.5 text-sm text-muted-foreground">
                                                    {timeAgo(asset.created_at)}
                                                </td>
                                                <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => copyToClipboard(getPublicUrl(asset.file_path))}
                                                            >
                                                                <Copy className="mr-2 h-4 w-4" /> Copy URL
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => window.open(getPublicUrl(asset.file_path), '_blank')}
                                                            >
                                                                <ExternalLink className="mr-2 h-4 w-4" /> Open in tab
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => setDeleteTarget(asset)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Detail side panel */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            File Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedAsset && (
                        <MediaDetailPanel
                            asset={selectedAsset}
                            onSave={(updates) => {
                                updateMutation.mutate({ id: selectedAsset.id, ...updates });
                                setSelectedAsset({ ...selectedAsset, ...updates });
                            }}
                            onCopyUrl={() => copyToClipboard(getPublicUrl(selectedAsset.file_path))}
                            isSaving={updateMutation.isPending}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{deleteTarget?.original_name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove the file from storage and its metadata.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

// ── MediaDetailPanel sub-component ──────────────────────────────────
function MediaDetailPanel({
    asset,
    onSave,
    onCopyUrl,
    isSaving,
}: {
    asset: MediaAsset;
    onSave: (updates: Partial<MediaAsset>) => void;
    onCopyUrl: () => void;
    isSaving: boolean;
}) {
    const [altText, setAltText] = useState(asset.alt_text ?? '');
    const [caption, setCaption] = useState(asset.caption ?? '');
    const [assetFolder, setAssetFolder] = useState(asset.folder);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(asset.tags ?? []);

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setTagInput('');
    };

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                {asset.mime_type.startsWith('image/') ? (
                    <img
                        src={getPublicUrl(asset.file_path)}
                        alt={altText || asset.original_name}
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <div className="text-center p-6">
                        {(() => {
                            const Icon = getFileIcon(asset.mime_type);
                            return <Icon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-2" />;
                        })()}
                        <p className="text-sm text-muted-foreground">{asset.original_name}</p>
                    </div>
                )}
            </div>

            {/* File info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{formatBytes(asset.file_size)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{asset.mime_type}</p>
                </div>
                {asset.width && asset.height && (
                    <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-muted-foreground">Dimensions</p>
                        <p className="font-medium">{asset.width} × {asset.height}</p>
                    </div>
                )}
                <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-muted-foreground">Uploaded</p>
                    <p className="font-medium">{new Date(asset.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* URL copy */}
            <div className="flex gap-2">
                <Input
                    readOnly
                    value={getPublicUrl(asset.file_path)}
                    className="text-xs font-mono"
                />
                <Button variant="outline" size="icon" onClick={onCopyUrl}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>

            {/* Editable fields */}
            <div className="space-y-3">
                <div>
                    <Label className="text-xs">Alt Text</Label>
                    <Input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Describe this image for accessibility..."
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label className="text-xs">Caption</Label>
                    <Textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Optional caption..."
                        rows={2}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label className="text-xs">Folder</Label>
                    <Select value={assetFolder} onValueChange={setAssetFolder}>
                        <SelectTrigger className="mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FOLDERS.map((f) => (
                                <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs">Tags</Label>
                    <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                                {tag}
                                <button
                                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                                    className="ml-0.5 rounded-full hover:bg-destructive/20"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="text-xs"
                        />
                        <Button variant="outline" size="sm" onClick={addTag}>
                            <Tag className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <Button
                className="w-full"
                onClick={() => onSave({ alt_text: altText, caption, folder: assetFolder, tags })}
                disabled={isSaving}
            >
                <Check className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Details'}
            </Button>
        </div>
    );
}

// ── Helper: get image dimensions ────────────────────────────────────
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export default AdminMedia;
