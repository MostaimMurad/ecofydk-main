import { useState } from 'react';
import { Sparkles, Loader2, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface TranslatableFieldProps {
    /** The label shown above the field pair */
    label: string;
    /** Current English value */
    enValue: string;
    /** Current Danish value */
    daValue: string;
    /** Called when English value changes */
    onEnChange: (value: string) => void;
    /** Called when Danish value changes */
    onDaChange: (value: string) => void;
    /** If true, render Textarea instead of Input */
    multiline?: boolean;
    /** If true, render RichTextEditor instead of Textarea */
    richText?: boolean;
    /** Number of rows for textarea */
    rows?: number;
    /** Placeholder text for English field */
    enPlaceholder?: string;
    /** Placeholder text for Danish field */
    daPlaceholder?: string;
    /** If true, stack fields vertically instead of side-by-side */
    stacked?: boolean;
}

const TranslatableField = ({
    label,
    enValue,
    daValue,
    onEnChange,
    onDaChange,
    multiline = false,
    richText = false,
    rows = 3,
    enPlaceholder = '',
    daPlaceholder = '',
    stacked = false,
}: TranslatableFieldProps) => {
    const { translate, isTranslating } = useAutoTranslate();
    const { toast } = useToast();
    const [translationDirection, setTranslationDirection] = useState<'en-to-da' | 'da-to-en'>('en-to-da');

    const handleTranslate = async () => {
        try {
            if (translationDirection === 'en-to-da') {
                if (!enValue.trim()) {
                    toast({ title: 'Enter English text first', variant: 'destructive' });
                    return;
                }
                const result = await translate(enValue, 'en', 'da');
                if (result) onDaChange(result);
            } else {
                if (!daValue.trim()) {
                    toast({ title: 'Enter Danish text first', variant: 'destructive' });
                    return;
                }
                const result = await translate(daValue, 'da', 'en');
                if (result) onEnChange(result);
            }
            toast({ title: '✅ Translation complete' });
        } catch {
            toast({ title: 'Translation failed — please try again', variant: 'destructive' });
        }
    };

    const InputComponent = multiline ? Textarea : Input;

    const renderField = (lang: 'en' | 'da', value: string, onChange: (v: string) => void, placeholder: string) => {
        const flag = lang === 'en' ? '🇬🇧' : '🇩🇰';
        const langLabel = lang === 'en' ? 'English' : 'Dansk';

        return (
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs">{flag}</span>
                    <span className="text-xs font-medium text-muted-foreground">{langLabel}</span>
                </div>
                {richText ? (
                    <RichTextEditor
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />
                ) : (
                    <InputComponent
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={multiline ? rows : undefined}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">{label}</Label>
                {enValue && daValue && (
                    <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        ✅ Both languages
                    </Badge>
                )}
                {enValue && !daValue && (
                    <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        ⚠️ Missing Dansk
                    </Badge>
                )}
                {!enValue && daValue && (
                    <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        ⚠️ Missing English
                    </Badge>
                )}
            </div>

            <div className={stacked ? "space-y-4" : "grid gap-3 sm:grid-cols-2"}>
                {renderField('en', enValue, onEnChange, enPlaceholder)}
                {renderField('da', daValue, onDaChange, daPlaceholder)}
            </div>

            {/* Translation controls */}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="h-8 text-xs gap-1.5 rounded-lg border-primary/30 hover:bg-primary/5 hover:border-primary/50"
                >
                    {isTranslating ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Translating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            {translationDirection === 'en-to-da' ? 'EN → DA' : 'DA → EN'} Auto Translate
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTranslationDirection(translationDirection === 'en-to-da' ? 'da-to-en' : 'en-to-da')}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title="Swap translation direction"
                >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default TranslatableField;
