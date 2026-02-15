import { useState, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  currentLogoUrl: string | null;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const LogoUpload = ({ currentLogoUrl, onUploadComplete, onRemove }: LogoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PNG, JPG, SVG, or WEBP.';
    }
    if (file.size > MAX_SIZE) {
      return 'File too large. Maximum size is 2MB.';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({ title: 'Upload Error', description: error, variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${ext}`;

      // Delete old logo if exists
      if (currentLogoUrl) {
        const oldPath = currentLogoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('site-settings').remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('site-settings')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-settings')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
      toast({ title: 'Success', description: 'Logo uploaded successfully!' });
    } catch (err: any) {
      toast({ 
        title: 'Upload Failed', 
        description: err.message || 'Failed to upload logo', 
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [currentLogoUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = async () => {
    if (currentLogoUrl) {
      const path = currentLogoUrl.split('/').pop();
      if (path) {
        await supabase.storage.from('site-settings').remove([path]);
      }
    }
    onRemove();
  };

  return (
    <div className="space-y-4">
      {/* Current Logo Preview */}
      {currentLogoUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Current Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg border bg-muted/50 flex items-center justify-center overflow-hidden">
              <img 
                src={currentLogoUrl} 
                alt="Current logo" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {currentLogoUrl ? 'Replace Logo' : 'Upload Logo'}
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onClick={() => document.getElementById('logo-input')?.click()}
        >
          <input
            id="logo-input"
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop image here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, SVG, JPG, WEBP (max 2MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;
