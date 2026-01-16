import { useState } from 'react';
import { searchBySketch } from '../api/VisualSearch';
import { SimilarImage } from '../types';

// Helper function to convert data URL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const useSketchSearch = () => {
  const [results, setResults] = useState<SimilarImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (canvasRef: any) => {
    if (!canvasRef.current) {
      console.log('Canvas ref is not available');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Starting search...');

    try {
      //Convert the React Canvas to a data URL (base64 string)
      console.log('Exporting canvas to image...');
      const dataUrl = await canvasRef.current.exportImage('png'); 
      console.log('Image exported as data URL, length:', dataUrl.length);
      
      // Convert data URL to Blob
      const imageBlob = dataURLtoBlob(dataUrl);
      console.log('Image blob created, size:', imageBlob.size, 'bytes', 'type:', imageBlob.type);
      
      //Send to Python Backend
      console.log('Sending sketch to backend...');
      const data = await searchBySketch(imageBlob);
      console.log('Backend response received:', data);
      
      // Update State with similar_images array
      setResults(data.similar_images || []);
      console.log('Search results updated:', data.similar_images?.length || 0, 'matches found');
    } catch (err) {
      setError('Failed to find matching layouts.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
      console.log('Search completed');
    }
  };

  return { results, isLoading, error, handleSearch };
};