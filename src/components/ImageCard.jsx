// src/components/ImageCard.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { useImageLoad } from '@/hooks/useImageLoad';
import { cn } from '@/lib/utils';

const ImageCard = memo(({ image, onSelect }) => {
    const { loaded, error, imageRef } = useImageLoad();

    // Calculate aspect ratio placeholder
    const aspectRatio = image.imgbb_height / image.imgbb_width;
    const paddingTop = `${aspectRatio * 100}%`;

    return (
        <Card
            className={cn(
                "cursor-pointer hover:shadow-lg transition-shadow",
                "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                "outline-none"
            )}
            onClick={() => onSelect(image)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(image);
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${image.imgbb_title || 'Untitled image'}`}
        >
            <CardContent className="p-3">
                <div
                    className="relative w-full"
                    style={{ paddingTop }}
                >
                    {/* Placeholder/Loading state */}
                    <div
                        className={cn(
                            "absolute inset-0 bg-muted animate-pulse",
                            loaded && "hidden"
                        )}
                    />

                    {/* Image */}
                    <img
                        ref={imageRef}
                        src={image.imgbb_display_url}
                        alt={image.imgbb_title || 'Generated Image'}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-300",
                            loaded ? "opacity-100" : "opacity-0"
                        )}
                        loading="lazy"
                    />

                    {/* Error state */}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <span className="text-sm text-muted-foreground">
                                Failed to load image
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-2 space-y-1">
                    <h3 className="font-semibold truncate text-sm">
                        {image.imgbb_title || 'Untitled'}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {new Date(image.generation_timestamp).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});

ImageCard.displayName = 'ImageCard';

ImageCard.propTypes = {
    image: PropTypes.shape({
        id: PropTypes.number.isRequired,
        imgbb_display_url: PropTypes.string.isRequired,
        imgbb_title: PropTypes.string,
        generation_timestamp: PropTypes.string.isRequired,
        imgbb_width: PropTypes.number.isRequired,
        imgbb_height: PropTypes.number.isRequired
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
    priority: PropTypes.bool
};

export default ImageCard;