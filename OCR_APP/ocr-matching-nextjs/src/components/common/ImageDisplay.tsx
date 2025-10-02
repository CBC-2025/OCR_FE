import React, { useState, useEffect } from 'react';
import { getImageUrl } from '@/libs/rootApi';

interface ImageDisplayProps {
  imagePath: string;
  alt: string;
  className?: string;
  cacheBuster?: string | number;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imagePath, alt, className = '', cacheBuster }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePath) {
      setLoading(false);
      setError('No image path provided');
      return;
    }

    try {
      // Use the helper function to get the image URL, include cache buster if provided
      const url = getImageUrl(imagePath, cacheBuster);
      setImageUrl(url);
      setLoading(false);
    } catch (err) {
      setError('Failed to load image');
      setLoading(false);
    }
  }, [imagePath]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`} style={{ minHeight: '60px' }}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded text-gray-500 text-xs ${className}`} style={{ minHeight: '60px' }}>
        No image
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full h-auto rounded border"
        style={{ maxHeight: '80px' }}
        onError={() => setError('Failed to load image')}
      />
    </div>
  );
};

export default ImageDisplay;