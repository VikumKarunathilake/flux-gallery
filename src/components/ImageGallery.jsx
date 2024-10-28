// src/components/ImageGallery.jsx
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';

const ImageGallery = ({ images, onImageSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
                <Card
                    key={image.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onImageSelect(image)}
                >
                    <CardContent className="p-4">
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                            <img
                                src={image.imgbb_display_url}
                                alt={image.imgbb_title || 'Generated Image'}
                                className="rounded-lg object-cover w-full h-full"
                                loading="lazy"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold truncate">
                                {image.imgbb_title || 'Untitled'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                                {new Date(image.generation_timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
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
    onImageSelect: PropTypes.func.isRequired
};

export default ImageGallery;