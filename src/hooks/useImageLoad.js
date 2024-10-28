// src/hooks/useImageLoad.js
import { useRef, useState, useEffect } from 'react';

export const useImageLoad = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image) return;

    // If the image is already loaded (e.g. from cache), set loaded to true
    if (image.complete) {
      setLoaded(true);
      return;
    }

    const handleLoad = () => {
      setLoaded(true);
      setError(false);
    };

    const handleError = () => {
      setLoaded(true);
      setError(true);
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);

    return () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };
  }, []);

  return {
    loaded,
    error,
    imageRef
  };
};