import { useState } from 'react';
import { searchBySketch } from '../api/VisualSearch';
import { SearchMatch } from '../types';

export const useSketchSearch = () => {
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (canvasRef: any) => {
    if (!canvasRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      //Convert the React Canvas to a Blob (Image file)
      const imageBlob = await canvasRef.current.exportImage('blob'); 
      
      //Send to Python Backend
      const data = await searchBySketch(imageBlob);
      
      // Update State
      setResults(data.matches);
    } catch (err) {
      setError('Failed to find matching layouts.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, handleSearch };
};