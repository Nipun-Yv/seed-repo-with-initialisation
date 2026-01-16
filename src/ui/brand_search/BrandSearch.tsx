import React, { useRef, useState } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { CanvasToolbar } from './components/CanvasToolbar';
import { SketchCanvas } from './components/SketchCanvas';
import { FindSimilar } from './components/FindSimilar';
import { SearchResponse } from './types';

const BrandSearch = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);

  const handleUpload = (files: FileList) => {
    console.log('Uploaded files:', files);
  };

  const handleUndo = () => canvasRef.current?.undo();
  const handleRedo = () => canvasRef.current?.redo();
  const handleClear = () => canvasRef.current?.clearCanvas();

  const handleFindSimilar = async () => {
    console.log('[BrandSearch] handleFindSimilar called');
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      console.log('[BrandSearch] Checking canvas ref...');
      if (!canvasRef.current) {
        console.warn('[BrandSearch] Canvas ref is not available');
        setError('Please draw something on the canvas first');
        setLoading(false);
        return;
      }

      console.log('[BrandSearch] Exporting canvas to image...');
      const dataUrl = await canvasRef.current.exportImage('png');
      console.log('[BrandSearch] Canvas exported, data URL length:', dataUrl.length);

      // Convert data URL to Blob
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const imageBlob = new Blob([u8arr], { type: mime });
      console.log('[BrandSearch] Image blob created, size:', imageBlob.size, 'bytes');

      // Import and call the search API
      const { searchBySketch } = await import('./api/VisualSearch');
      console.log('[BrandSearch] Calling searchBySketch API...');
      
      const response = await searchBySketch(imageBlob);
      console.log('[BrandSearch] API response received:', response);
      console.log('[BrandSearch] Response type:', typeof response);
      console.log('[BrandSearch] Response keys:', Object.keys(response || {}));
      console.log('[BrandSearch] Similar images:', response.similar_images);
      console.log('[BrandSearch] Similar images length:', response.similar_images?.length);
      
      setResults(response);
      console.log('[BrandSearch] Results state updated');
    } catch (err) {
      console.error('[BrandSearch] Error in handleFindSimilar:', err);
      setError(err instanceof Error ? err.message : 'Failed to find similar images');
    } finally {
      setLoading(false);
      console.log('[BrandSearch] Loading set to false');
    }
  };

  const handleClearResults = () => {
    setResults(null);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#FAFAFA]">
      {/* Canvas Section */}
      <div className="flex flex-col p-4 gap-3 flex-1 min-h-0">
        <CanvasToolbar 
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onUpload={handleUpload}
        />
        <SketchCanvas canvasRef={canvasRef} />
      </div>
      
      {/* Search Section */}
      <FindSimilar 
        onFindSimilar={handleFindSimilar}
        loading={loading}
        error={error}
        results={results}
        onClearResults={handleClearResults}
      />
    </div>
  );
};

export default BrandSearch;