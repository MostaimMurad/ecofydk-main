import { useEffect, useState, useCallback, Component, ReactNode } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3, List, ListOrdered,
    AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
    Image as ImageIcon, Highlighter, Undo2, Redo2,
    Code, Quote, Minus, Unlink, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────
interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
    onImageRequest?: () => void;
}

// ── Error Boundary ─────────────────────────────────────────────────
class EditorErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean; errorMsg: string }
> {
    constructor(props: { children: ReactNode; fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, errorMsg: error.message };
    }
    componentDidCatch(error: Error) {
        console.error('[RichTextEditor] Runtime crash:', error.message, error.stack);
    }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

// ── Toolbar Button ───────────────────────────────────────────────────
function ToolbarBtn({
    icon: Icon, label, active, onClick, disabled,
}: {
    icon: any; label: string; active?: boolean; onClick: () => void; disabled?: boolean;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
                'h-8 w-8 rounded-md',
                active && 'bg-primary/10 text-primary'
            )}
            onClick={onClick}
            disabled={disabled}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );
}

// ── Textarea Fallback ────────────────────────────────────────────────
function FallbackEditor({ value, onChange, placeholder, minHeight }: {
    value: string; onChange: (html: string) => void; placeholder?: string; minHeight?: string;
}) {
    return (
        <div className="rounded-lg border bg-background overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Rich text editor unavailable — using plain text mode</span>
            </div>
            <Textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ minHeight }}
                className="border-0 rounded-none focus-visible:ring-0 resize-y"
            />
        </div>
    );
}

// ── TipTap Editor with dynamic imports ───────────────────────────────
function TipTapEditor(props: RichTextEditorProps) {
    const { value, onChange, placeholder = 'Start writing...', className, minHeight = '160px', onImageRequest } = props;
    const [modules, setModules] = useState<any>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [
                    reactMod, starterKitMod, imageMod, linkMod,
                    placeholderMod, textAlignMod, underlineMod, highlightMod
                ] = await Promise.all([
                    import('@tiptap/react'),
                    import('@tiptap/starter-kit'),
                    import('@tiptap/extension-image'),
                    import('@tiptap/extension-link'),
                    import('@tiptap/extension-placeholder'),
                    import('@tiptap/extension-text-align'),
                    import('@tiptap/extension-underline'),
                    import('@tiptap/extension-highlight'),
                ]);
                if (!cancelled) {
                    setModules({
                        useEditor: reactMod.useEditor,
                        EditorContent: reactMod.EditorContent,
                        BubbleMenu: reactMod.BubbleMenu,
                        StarterKit: starterKitMod.default ?? starterKitMod.StarterKit,
                        Image: imageMod.default ?? imageMod.Image,
                        Link: linkMod.default ?? linkMod.Link,
                        Placeholder: placeholderMod.default ?? placeholderMod.Placeholder,
                        TextAlign: textAlignMod.default ?? textAlignMod.TextAlign,
                        Underline: underlineMod.default ?? underlineMod.Underline,
                        Highlight: highlightMod.default ?? highlightMod.Highlight,
                    });
                }
            } catch (err: any) {
                console.error('[RichTextEditor] Failed to load TipTap:', err);
                if (!cancelled) setLoadError(err?.message || 'Unknown error');
            }
        })();

        return () => { cancelled = true; };
    }, []);

    if (loadError) {
        return <FallbackEditor value={value} onChange={onChange} placeholder={placeholder} minHeight={minHeight} />;
    }

    if (!modules) {
        return (
            <div className={cn('rounded-lg border bg-background animate-pulse', className)} style={{ minHeight }}>
                <div className="h-10 bg-muted/30 border-b" />
                <div className="p-3 space-y-2">
                    <div className="h-4 bg-muted/20 rounded w-3/4" />
                    <div className="h-4 bg-muted/20 rounded w-1/2" />
                </div>
            </div>
        );
    }

    return <TipTapEditorLoaded modules={modules} {...props} />;
}

// ── Loaded TipTap Editor (modules available) ─────────────────────────
function TipTapEditorLoaded({
    modules, value, onChange, placeholder = 'Start writing...',
    className, minHeight = '160px', onImageRequest,
}: RichTextEditorProps & { modules: any }) {
    const {
        useEditor, EditorContent, BubbleMenu,
        StarterKit, Image, Link, Placeholder: PlaceholderExt,
        TextAlign, Underline, Highlight
    } = modules;

    const [linkUrl, setLinkUrl] = useState('');
    const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline,
            Highlight.configure({ multicolor: false }),
            Image.configure({ inline: false, allowBase64: false }),
            Link.configure({ openOnClick: false, autolink: true }),
            PlaceholderExt.configure({ placeholder }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
                    'prose-headings:font-semibold prose-headings:tracking-tight',
                    'prose-p:leading-relaxed prose-li:leading-relaxed',
                    'prose-a:text-primary prose-a:underline',
                    'prose-img:rounded-lg prose-img:my-4',
                ),
                style: `min-height: ${minHeight}; padding: 0.75rem;`,
            },
        },
        onUpdate: ({ editor }: any) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    const insertLink = useCallback(() => {
        if (!editor || !linkUrl) return;
        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        setLinkUrl('');
        setLinkPopoverOpen(false);
    }, [editor, linkUrl]);

    const insertImageUrl = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('Image URL:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className={cn('rounded-lg border bg-background overflow-hidden', className)}>
            <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1">
                <ToolbarBtn icon={Undo2} label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
                <ToolbarBtn icon={Redo2} label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
                <Separator orientation="vertical" className="mx-0.5 h-6" />
                <ToolbarBtn icon={Bold} label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
                <ToolbarBtn icon={Italic} label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
                <ToolbarBtn icon={UnderlineIcon} label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                <ToolbarBtn icon={Strikethrough} label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
                <ToolbarBtn icon={Highlighter} label="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} />
                <ToolbarBtn icon={Code} label="Inline Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
                <Separator orientation="vertical" className="mx-0.5 h-6" />
                <ToolbarBtn icon={Heading1} label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
                <ToolbarBtn icon={Heading2} label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
                <ToolbarBtn icon={Heading3} label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
                <Separator orientation="vertical" className="mx-0.5 h-6" />
                <ToolbarBtn icon={List} label="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
                <ToolbarBtn icon={ListOrdered} label="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
                <ToolbarBtn icon={Quote} label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
                <ToolbarBtn icon={Minus} label="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
                <Separator orientation="vertical" className="mx-0.5 h-6" />
                <ToolbarBtn icon={AlignLeft} label="Align Left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
                <ToolbarBtn icon={AlignCenter} label="Align Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
                <ToolbarBtn icon={AlignRight} label="Align Right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
                <Separator orientation="vertical" className="mx-0.5 h-6" />
                <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon"
                            className={cn('h-8 w-8 rounded-md', editor.isActive('link') && 'bg-primary/10 text-primary')}
                            title="Insert Link"><LinkIcon className="h-4 w-4" /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3" align="start">
                        <div className="flex gap-2">
                            <Input placeholder="https://example.com" value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && insertLink()} className="text-sm" />
                            <Button size="sm" onClick={insertLink}>Add</Button>
                        </div>
                        {editor.isActive('link') && (
                            <Button variant="ghost" size="sm" className="mt-2 text-destructive gap-1"
                                onClick={() => { editor.chain().focus().unsetLink().run(); setLinkPopoverOpen(false); }}>
                                <Unlink className="h-3.5 w-3.5" /> Remove link
                            </Button>
                        )}
                    </PopoverContent>
                </Popover>
                <ToolbarBtn icon={ImageIcon} label="Insert Image" onClick={onImageRequest ?? insertImageUrl} />
            </div>
            {editor && BubbleMenu && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
                    <div className="flex items-center gap-0.5 rounded-lg border bg-background shadow-lg px-1 py-0.5">
                        <ToolbarBtn icon={Bold} label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
                        <ToolbarBtn icon={Italic} label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
                        <ToolbarBtn icon={UnderlineIcon} label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                        <ToolbarBtn icon={Highlighter} label="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} />
                    </div>
                </BubbleMenu>
            )}
            <EditorContent editor={editor} />
        </div>
    );
}

// ── Main Export ────────────────────────────────────────────────────────
export default function RichTextEditor(props: RichTextEditorProps) {
    return (
        <EditorErrorBoundary
            fallback={<FallbackEditor value={props.value} onChange={props.onChange} placeholder={props.placeholder} minHeight={props.minHeight} />}
        >
            <TipTapEditor {...props} />
        </EditorErrorBoundary>
    );
}
