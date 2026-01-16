import React, { useRef } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { CanvasToolbar } from './components/CanvasToolbar';
import { SketchCanvas } from './components/SketchCanvas';

const BrandSearch = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleUndo = () => canvasRef.current?.undo();
  const handleRedo = () => canvasRef.current?.redo();
  const handleClear = () => canvasRef.current?.clearCanvas();

  return (
    <div className="flex flex-col h-full w-full p-4">
      <CanvasToolbar 
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
      />
      <SketchCanvas canvasRef={canvasRef} />
    </div>
  );
};

export default BrandSearch;