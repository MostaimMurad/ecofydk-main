import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Send, AlertTriangle, Lightbulb, TrendingUp, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const typeOptions = [
    { value: 'bug', label: '🐛 Bug', icon: Bug, color: 'text-red-500' },
    { value: 'feature', label: '✨ Feature Request', icon: Lightbulb, color: 'text-blue-500' },
    { value: 'improvement', label: '📈 Improvement', icon: TrendingUp, color: 'text-green-500' },
];

const priorityOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'low', label: 'Low', color: 'bg-green-500' },
];

const AdminFeedbackForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
    const [formData, setFormData] = useState({
        type: 'bug',
        priority: 'medium',
        title: '',
        description: '',
    });

    const location = useLocation();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const captureScreenshot = useCallback(async () => {
        setIsCapturing(true);
        try {
            // Capture the main content area (exclude the floating button itself)
            const mainContent = document.querySelector('main') || document.body;
            const canvas = await html2canvas(mainContent as HTMLElement, {
                useCORS: true,
                allowTaint: true,
                scale: 0.75, // Reduce size for performance
                logging: false,
            });

            const dataUrl = canvas.toDataURL('image/png');
            setScreenshotPreview(dataUrl);

            // Convert to blob for upload
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            setScreenshotBlob(blob);
        } catch (err) {
            console.error('Screenshot capture failed:', err);
        } finally {
            setIsCapturing(false);
        }
    }, []);

    const handleOpen = async () => {
        // First capture screenshot, THEN open the form
        await captureScreenshot();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setScreenshotPreview(null);
        setScreenshotBlob(null);
        setFormData({ type: 'bug', priority: 'medium', title: '', description: '' });
    };

    const submitMutation = useMutation({
        mutationFn: async () => {
            let screenshotUrl: string | null = null;

            // Upload screenshot if captured
            if (screenshotBlob) {
                const fileName = `screenshot_${Date.now()}.png`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('feedback-screenshots')
                    .upload(fileName, screenshotBlob, { contentType: 'image/png' });

                if (!uploadError && uploadData) {
                    const { data: urlData } = supabase.storage
                        .from('feedback-screenshots')
                        .getPublicUrl(uploadData.path);
                    screenshotUrl = urlData.publicUrl;
                }
            }

            // Insert ticket
            const { error } = await supabase.from('feedback_tickets').insert({
                type: formData.type,
                priority: formData.priority,
                title: formData.title,
                description: formData.description,
                submitted_from_url: location.pathname,
                screenshot_url: screenshotUrl,
                submitted_by: user?.id,
            });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
            queryClient.invalidateQueries({ queryKey: ['admin-feedback-count'] });
            toast({ title: '✅ Issue submitted', description: 'Your issue has been recorded.' });
            handleClose();
        },
        onError: () => {
            toast({ title: 'Submission failed', variant: 'destructive' });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            toast({ title: 'Please fill in title and description', variant: 'destructive' });
            return;
        }
        submitMutation.mutate();
    };

    return (
        <>
            {/* Floating Report Issue Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    disabled={isCapturing}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                    {isCapturing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Bug className="h-5 w-5" />
                    )}
                    <span className="font-medium text-sm">Report Issue</span>
                </motion.button>
            )}

            {/* Slide-out Form Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30 z-50"
                            onClick={handleClose}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l shadow-2xl z-50 overflow-y-auto"
                        >
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold font-serif">Report Issue</h2>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            From: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</code>
                                        </p>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={handleClose}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Screenshot Preview */}
                                {screenshotPreview && (
                                    <div className="space-y-1.5">
                                        <Label className="text-muted-foreground text-xs">📸 Auto-captured Screenshot</Label>
                                        <div className="border rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={screenshotPreview}
                                                alt="Page screenshot"
                                                className="w-full h-32 object-cover object-top"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Type */}
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typeOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorityOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                                                        {opt.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        placeholder="Brief description of the issue..."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Describe the issue in detail. What happened? What did you expect?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={submitMutation.isPending}
                                >
                                    {submitMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Submit Issue
                                </Button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminFeedbackForm;
