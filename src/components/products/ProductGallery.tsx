import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const allImages = images.length > 0 ? images : ['/placeholder.svg'];
  const currentImage = allImages[selectedIndex];

  // Reset zoom/pan on image change
  useEffect(() => {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
  }, [selectedIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isLightboxOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Lightbox zoom controls
  const zoomIn = () => setLightboxZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () => {
    setLightboxZoom((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setLightboxPan({ x: 0, y: 0 });
      return next;
    });
  };
  const resetZoom = () => {
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
  };

  // Lightbox pan (drag when zoomed)
  const handleLightboxMouseDown = (e: React.MouseEvent) => {
    if (lightboxZoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y });
  };
  const handleLightboxMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setLightboxPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleLightboxMouseUp = () => setIsDragging(false);

  // Scroll to zoom in lightbox
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLightboxOpen) return;
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setIsLightboxOpen(false);
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
    if (e.key === '0') resetZoom();
  }, [isLightboxOpen, handlePrevious, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Double-click to toggle zoom in lightbox
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxZoom > 1) {
      resetZoom();
    } else {
      setLightboxZoom(2.5);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image — Hover Zoom */}
      <motion.div
        ref={imageContainerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-muted group cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AspectRatio ratio={1}>
          <img
            src={currentImage}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className={cn(
              'h-full w-full object-cover transition-transform duration-300',
              isZoomed && 'scale-[2]'
            )}
            style={
              isZoomed
                ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                : undefined
            }
          />
        </AspectRatio>

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100 border border-border/30">
          <ZoomIn className="h-4 w-4 text-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Click to expand</span>
        </div>

        {/* Image counter badge */}
        {allImages.length > 1 && (
          <div className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground border border-border/30">
            {selectedIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm shadow-lg"
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm shadow-lg"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </motion.div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((img, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative overflow-hidden rounded-xl transition-all',
                selectedIndex === index
                  ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                  : 'hover:ring-2 hover:ring-primary/50 opacity-70 hover:opacity-100'
              )}
            >
              <AspectRatio ratio={1}>
                <img
                  src={img}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </motion.button>
          ))}
        </div>
      )}

      {/* ========== LIGHTBOX ========== */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Controls Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
              {/* Counter */}
              {allImages.length > 1 && (
                <div className="rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm text-white font-medium">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              )}
              {allImages.length <= 1 && <div />}

              {/* Zoom controls */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 rounded-full h-9 w-9"
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}>
                  <Minus className="h-4 w-4" />
                </Button>
                <button className="text-white/80 text-xs font-medium min-w-[3rem] text-center hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}>
                  {Math.round(lightboxZoom * 100)}%
                </button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 rounded-full h-9 w-9"
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}>
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-white/20 mx-1" />
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 rounded-full h-9 w-9"
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 rounded-full h-9 w-9"
                  onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <Button variant="ghost" size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/15 rounded-full h-12 w-12"
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}>
                  <ChevronLeft className="h-7 w-7" />
                </Button>
                <Button variant="ghost" size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/15 rounded-full h-12 w-12"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                  <ChevronRight className="h-7 w-7" />
                </Button>
              </>
            )}

            {/* Main Lightbox Image — Zoom + Pan */}
            <div
              className={cn(
                "flex-1 flex items-center justify-center w-full overflow-hidden",
                lightboxZoom > 1 ? 'cursor-grab' : 'cursor-zoom-in',
                isDragging && 'cursor-grabbing'
              )}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleDoubleClick}
              onMouseDown={handleLightboxMouseDown}
              onMouseMove={handleLightboxMouseMove}
              onMouseUp={handleLightboxMouseUp}
              onMouseLeave={handleLightboxMouseUp}
              onWheel={handleWheel}
            >
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                src={currentImage}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                className="max-h-[80vh] max-w-[90vw] object-contain select-none"
                draggable={false}
                style={{
                  transform: `scale(${lightboxZoom}) translate(${lightboxPan.x / lightboxZoom}px, ${lightboxPan.y / lightboxZoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease',
                }}
              />
            </div>

            {/* Bottom Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent py-4">
                <div className="flex justify-center gap-2 px-4">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                      className={cn(
                        'h-14 w-14 overflow-hidden rounded-lg border-2 transition-all flex-shrink-0',
                        selectedIndex === index
                          ? 'border-white shadow-lg shadow-white/20'
                          : 'border-transparent opacity-50 hover:opacity-90'
                      )}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard hint */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-xs hidden md:block">
              Scroll to zoom · Double-click to magnify · Arrow keys to navigate · Esc to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
