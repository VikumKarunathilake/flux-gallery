// src/lib/imageCache.js
class ImageCache {
    constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default cache duration
      this.cache = new Map();
      this.maxAge = maxAge;
    }
  
    set(key, value) {
      this.cache.set(key, {
        value,
        timestamp: Date.now()
      });
    }
  
    get(key) {
      const item = this.cache.get(key);
      
      if (!item) {
        return null;
      }
  
      // Check if the cached item has expired
      if (Date.now() - item.timestamp > this.maxAge) {
        this.cache.delete(key);
        return null;
      }
  
      return item.value;
    }
  
    has(key) {
      const item = this.cache.get(key);
      
      if (!item) {
        return false;
      }
  
      // Check if the cached item has expired
      if (Date.now() - item.timestamp > this.maxAge) {
        this.cache.delete(key);
        return false;
      }
  
      return true;
    }
  
    clear() {
      this.cache.clear();
    }
  
    // Remove expired items from cache
    cleanup() {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > this.maxAge) {
          this.cache.delete(key);
        }
      }
    }
  
    // Get cache size
    size() {
      this.cleanup(); // Clean expired items before returning size
      return this.cache.size;
    }
  }
  
  // Create and export a singleton instance
  export const imageCache = new ImageCache();
  
  // Optional: Clean up expired cache items periodically
  setInterval(() => {
    imageCache.cleanup();
  }, 60 * 1000); // Clean up every minute