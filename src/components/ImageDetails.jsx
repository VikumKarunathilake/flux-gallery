// src/components/ImageDetails.jsx
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const DetailItem = ({ label, value }) => (
    <div>
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <p className="mt-1">{value}</p>
    </div>
);

DetailItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

const ImageDetails = ({ image, onClose }) => {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{image.imgbb_title || 'Image Details'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <img
                        src={image.imgbb_url}
                        alt={image.imgbb_title}
                        className="rounded-lg w-full"
                        loading="lazy"
                        style={{ height: '500px', width: 'auto' }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem
                            label="Dimensions"
                            value={`${image.generation_width} × ${image.generation_height}`}
                        />
                        <DetailItem label="Steps" value={image.generation_steps} />
                        <DetailItem label="Size" value={image.imgbb_size} />
                        <DetailItem
                            label="Generated"
                            value={new Date(image.generation_timestamp).toLocaleString()}
                        />
                        {image.generation_prompt && (
                            <div className="col-span-2">
                                <DetailItem label="Prompt" value={image.generation_prompt} />
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

ImageDetails.propTypes = {
    image: PropTypes.shape({
        imgbb_title: PropTypes.string,
        imgbb_url: PropTypes.string.isRequired,
        generation_width: PropTypes.number.isRequired,
        generation_height: PropTypes.number.isRequired,
        generation_steps: PropTypes.number.isRequired,
        imgbb_size: PropTypes.string.isRequired,
        generation_timestamp: PropTypes.string.isRequired,
        generation_prompt: PropTypes.string
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default ImageDetails;