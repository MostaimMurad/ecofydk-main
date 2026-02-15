import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    skeletonClassName?: string;
    aspectRatio?: 'square' | 'video' | 'auto';
}

const LazyImage = ({ src, alt, className, skeletonClassName, aspectRatio = 'auto' }: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Start loading 200px before visible
        );

        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    const aspectClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        auto: '',
    };

    return (
        <div ref={imgRef} className={cn('relative overflow-hidden', aspectClasses[aspectRatio])}>
            {/* Skeleton placeholder */}
            {!isLoaded && (
                <Skeleton className={cn('absolute inset-0 w-full h-full z-10', skeletonClassName)} />
            )}

            {/* Actual image — only loaded when in viewport */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        'w-full h-full object-cover transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                />
            )}
        </div>
    );
};

export default LazyImage;
