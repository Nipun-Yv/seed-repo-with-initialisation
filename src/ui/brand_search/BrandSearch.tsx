import React, { useRef, useState } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { AddOnSDKAPI } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { CanvasToolbar } from './components/CanvasToolbar';
import { SketchCanvas } from './components/SketchCanvas';
import { FindSimilar } from './components/FindSimilar';
import { SearchResponse } from './types';
import { storeFiles, getImageUrl } from './api/VisualSearch';

interface BrandSearchProps {
  addOnUISdk: AddOnSDKAPI;
}

const BrandSearch: React.FC<BrandSearchProps> = ({ addOnUISdk }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [canvasBackgroundImage, setCanvasBackgroundImage] = useState<string | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleUpload = async (files: FileList) => {
    console.log('[BrandSearch] handleUpload called');
    console.log('[BrandSearch] Number of files:', files.length);
    
    if (!files || files.length === 0) {
      console.warn('[BrandSearch] No files selected');
      setError('No files selected');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Log file details
      const filesArray: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file instanceof File) {
          filesArray.push(file);
        }
      }
      
      filesArray.forEach((file: File, index: number) => {
        console.log(`[BrandSearch] File ${index + 1}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified)
        });
      });

      // Call the store API directly (no dynamic import)
      console.log('[BrandSearch] About to call storeFiles API...');
      console.log('[BrandSearch] storeFiles function:', typeof storeFiles);
      console.log('[BrandSearch] Files to send:', files);
      console.log('[BrandSearch] Files length:', files.length);
      
      const response = await storeFiles(files);
      console.log('[BrandSearch] Store API response received:', response);
      console.log('[BrandSearch] Files stored successfully');
      
      // Create preview URLs for uploaded images
      const imageUrls: string[] = [];
      filesArray.forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(file);
          imageUrls.push(imageUrl);
          console.log('[BrandSearch] Created object URL for image:', imageUrl, 'file:', file.name, 'type:', file.type);
        }
      });
      
      console.log('[BrandSearch] Total image URLs created:', imageUrls.length);
      
      // Update uploaded images state (keep only the most recent 5)
      const imagesToShow = imageUrls.slice(-5);
      console.log('[BrandSearch] Setting uploaded images state:', imagesToShow.length, 'images');
      setUploadedImages(imagesToShow);
      
      // Show success message when images are uploaded
      if (imagesToShow.length > 0) {
        console.log('[BrandSearch] Showing upload success message');
        setShowUploadSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowUploadSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('[BrandSearch] Error in handleUpload:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files';
      setError(errorMessage);
    } finally {
      setUploading(false);
      console.log('[BrandSearch] Upload process completed');
    }
  };

  const handleUndo = () => canvasRef.current?.undo();
  const handleRedo = () => canvasRef.current?.redo();
  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    setCanvasBackgroundImage(null);
  };

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to find similar images';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('[BrandSearch] Loading set to false');
    }
  };

  const handleClearResults = () => {
    setResults(null);
  };


  const handleImageClick = async (imageUrl: string) => {
    console.log('[BrandSearch] Image clicked, loading onto Express document:', imageUrl);
    
    try {
      // Also load it as background on the sketch canvas
      canvasRef.current?.clearCanvas();
      setCanvasBackgroundImage(imageUrl);
      
      // Fetch the image from the URL (which is a relative path like "photos/filename.jpg")
      console.log('[BrandSearch] Fetching image from URL:', imageUrl);
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      // Convert response to blob
      const imageBlob = await response.blob();
      console.log('[BrandSearch] Image blob created, size:', imageBlob.size, 'bytes', 'type:', imageBlob.type);
      
      // Add image to Express document
      console.log('[BrandSearch] Adding image to Express document...');
      await addOnUISdk.app.document.addImage(imageBlob, {
        title: `Image from search results`
      });
      
      console.log('[BrandSearch] Image successfully added to Express document');
    } catch (err) {
      console.error('[BrandSearch] Error adding image to Express document:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add image to document';
      setError(errorMessage);
    }
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
        <SketchCanvas canvasRef={canvasRef} backgroundImage={canvasBackgroundImage} />
      </div>

      {/* Upload Success Message */}
      {showUploadSuccess && (
        <div className="bg-green-50 border-t border-green-200 mt-3 p-4 z-100">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-800">
              Images uploaded successfully!
            </p>
          </div>
        </div>
      )}
      
      {/* Search Section */}
      <div className='mt-2'>
        <FindSimilar 
          onFindSimilar={handleFindSimilar}
          loading={loading}
          error={error}
          results={results}
          onClearResults={handleClearResults}
          onImageClick={handleImageClick}
          uploadedImages={uploadedImages}
        />
      </div>

    </div>
  );
};

export default BrandSearch;