// src/components/ImageGallery.jsx
import { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import ImageCard from './ImageCard';
import LoadingSpinner from './LoadingSpinner';

const ImageGallery = ({
    images,
    onImageSelect,
    loading,
    hasMore,
    onLoadMore
}) => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        delay: 100
    });

    const throttleTimeout = useRef(null);

    const throttledLoadMore = useCallback(() => {
        if (throttleTimeout.current) return;

        if (hasMore && !loading) {
            throttleTimeout.current = setTimeout(() => {
                onLoadMore();
                throttleTimeout.current = null;
            }, 500);
        }
    }, [hasMore, loading, onLoadMore]);

    // Use useEffect instead of useCallback for the inView dependency
    useEffect(() => {
        if (inView) {
            throttledLoadMore();
        }
    }, [inView, throttledLoadMore]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_forwards]"
                        style={{
                            animationDelay: `${index * 100}ms`
                        }}
                        loading="lazy"
                    >
                        <ImageCard
                            image={image}
                            onSelect={onImageSelect}
                            priority={index < 4}
                        />
                    </div>
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div
                ref={ref}
                className="h-10 flex justify-center items-center mt-4"
            >
                {loading && <LoadingSpinner />}
            </div>
        </>
    );
};

ImageGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            imgbb_display_url: PropTypes.string.isRequired,
            imgbb_title: PropTypes.string,
            generation_timestamp: PropTypes.string.isRequired
        })
    ).isRequired,
    onImageSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired
};

export default ImageGallery;