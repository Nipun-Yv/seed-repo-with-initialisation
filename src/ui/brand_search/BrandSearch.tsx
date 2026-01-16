import React, { useRef, useEffect } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { CanvasToolbar } from './components/CanvasToolbar';
import { SketchCanvas } from './components/SketchCanvas';
import { SearchResults } from './components/SearchResults';
import { Button } from '../../../components/ui/button';
import { useSketchSearch } from './hooks/useSketchSearch';

const BrandSearch = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const { results, isLoading, error, handleSearch } = useSketchSearch();

  useEffect(() => {
    console.log('BrandSearch component mounted');
  }, []);

  const handleUndo = () => {
    console.log('Undo action triggered');
    canvasRef.current?.undo();
  };
  const handleRedo = () => {
    console.log('Redo action triggered');
    canvasRef.current?.redo();
  };
  const handleClear = () => {
    console.log('Clear canvas action triggered');
    canvasRef.current?.clearCanvas();
  };

  const handleSearchClick = async () => {
    console.log('Search button clicked, sending sketch to backend...');
    await handleSearch(canvasRef);
  };

  useEffect(() => {
    if (results.length > 0) {
      console.log('Search results updated:', results);
    }
  }, [results]);

  return (
    <div className="flex flex-col h-full w-full p-4 overflow-hidden">
      <CanvasToolbar 
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
      />
      <Button 
        onClick={handleSearchClick} 
        disabled={isLoading}
        className="mt-2 mb-2"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
      {error && (
        <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <SketchCanvas canvasRef={canvasRef} />
        </div>
        <SearchResults results={results} />
      </div>
    </div>
  );
};

export default BrandSearch;