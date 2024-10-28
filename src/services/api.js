// src/services/api.js
import { imageCache } from '@/lib/imageCache';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchImages = async (page = 1, perPage = 12) => {
  const cacheKey = `images_${page}_${perPage}`;
  
  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/images?page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the response
    imageCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};