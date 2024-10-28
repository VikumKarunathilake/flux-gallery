// src/App.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ImageGallery from './components/ImageGallery';
import ImageDetails from './components/ImageDetails';
import { fetchImages } from './services/api';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await fetchImages();
      setImages(data);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <ImageGallery
              images={images}
              onImageSelect={setSelectedImage}
            />
            {selectedImage && (
              <ImageDetails
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;