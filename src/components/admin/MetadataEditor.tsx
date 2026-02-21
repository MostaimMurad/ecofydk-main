import { useState, useEffect } from 'react';
import { Plus, Trash2, Code2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface KeyValuePair {
    key: string;
    value: string;
}

interface MetadataEditorProps {
    value: string; // JSON string
    onChange: (value: string) => void;
    className?: string;
}

/** Check if a JSON object is "flat" (only string/number/boolean values, no nesting) */
function isFlat(obj: Record<string, unknown>): boolean {
    return Object.values(obj).every(
        v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null
    );
}

function jsonToPairs(jsonStr: string): KeyValuePair[] | null {
    try {
        const obj = JSON.parse(jsonStr);
        if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) return null;
        if (!isFlat(obj)) return null;
        return Object.entries(obj).map(([key, val]) => ({
            key,
            value: val === null ? '' : String(val),
        }));
    } catch {
        return null;
    }
}

function pairsToJson(pairs: KeyValuePair[]): string {
    const obj: Record<string, string> = {};
    pairs.forEach(({ key, value }) => {
        if (key.trim()) obj[key.trim()] = value;
    });
    return JSON.stringify(obj, null, 2);
}

const MetadataEditor = ({ value, onChange, className }: MetadataEditorProps) => {
    const [mode, setMode] = useState<'visual' | 'json'>('visual');
    const [pairs, setPairs] = useState<KeyValuePair[]>([]);
    const [jsonText, setJsonText] = useState(value);
    const [jsonError, setJsonError] = useState('');

    useEffect(() => {
        const parsed = jsonToPairs(value);
        if (parsed) {
            setPairs(parsed);
            setMode('visual');
        } else {
            setMode('json');
        }
        setJsonText(value);
    }, []); // Only on mount

    // Update parent when pairs change (visual mode)
    const updatePairs = (newPairs: KeyValuePair[]) => {
        setPairs(newPairs);
        const json = pairsToJson(newPairs);
        setJsonText(json);
        onChange(json);
    };

    // Update parent when JSON text changes (json mode)
    const updateJson = (text: string) => {
        setJsonText(text);
        try {
            JSON.parse(text);
            setJsonError('');
            onChange(text);
            // Try to sync to visual
            const parsed = jsonToPairs(text);
            if (parsed) setPairs(parsed);
        } catch {
            setJsonError('Invalid JSON');
        }
    };

    const addPair = () => {
        updatePairs([...pairs, { key: '', value: '' }]);
    };

    const removePair = (index: number) => {
        updatePairs(pairs.filter((_, i) => i !== index));
    };

    const updatePairField = (index: number, field: 'key' | 'value', newValue: string) => {
        const updated = pairs.map((p, i) => i === index ? { ...p, [field]: newValue } : p);
        updatePairs(updated);
    };

    const canUseVisual = jsonToPairs(jsonText) !== null || pairs.length === 0;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                    Extra Properties
                </Label>
                <div className="flex gap-1">
                    <button
                        type="button"
                        className={cn(
                            "p-1 rounded text-xs flex items-center gap-1 transition-colors",
                            mode === 'visual'
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => canUseVisual && setMode('visual')}
                        title="Visual Editor"
                        disabled={!canUseVisual}
                    >
                        <List className="h-3 w-3" />
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "p-1 rounded text-xs flex items-center gap-1 transition-colors",
                            mode === 'json'
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setMode('json')}
                        title="JSON Editor"
                    >
                        <Code2 className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {mode === 'visual' ? (
                <div className="space-y-2">
                    {pairs.length === 0 ? (
                        <div className="text-center py-4 border border-dashed rounded-lg">
                            <p className="text-xs text-muted-foreground mb-2">
                                No extra properties yet
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPair}
                                className="gap-1 h-7 text-xs"
                            >
                                <Plus className="h-3 w-3" /> Add Property
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                {pairs.map((pair, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Input
                                            value={pair.key}
                                            onChange={e => updatePairField(i, 'key', e.target.value)}
                                            placeholder="Property name"
                                            className="h-8 text-xs flex-1"
                                        />
                                        <Input
                                            value={pair.value}
                                            onChange={e => updatePairField(i, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="h-8 text-xs flex-[2]"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => removePair(i)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addPair}
                                className="gap-1 h-7 text-xs"
                            >
                                <Plus className="h-3 w-3" /> Add Property
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-1">
                    <Textarea
                        value={jsonText}
                        onChange={e => updateJson(e.target.value)}
                        rows={4}
                        className={cn(
                            "font-mono text-xs",
                            jsonError && "border-destructive focus-visible:ring-destructive"
                        )}
                    />
                    {jsonError && (
                        <p className="text-[10px] text-destructive">{jsonError}</p>
                    )}
                </div>
            )}

            <p className="text-[10px] text-muted-foreground">
                Optional custom data attached to this block (e.g., link URL, badge text, external ID)
            </p>
        </div>
    );
};

export default MetadataEditor;
