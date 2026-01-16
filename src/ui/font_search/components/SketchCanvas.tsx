import React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import ReactCanvasDraw from 'react-canvas-draw';

interface SketchCanvasProps {
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ canvasRef }) => {
    return (
        <div className="flex-1 relative group min-h-[200px]">
            <div className="h-full w-full rounded-2xl border-2 border-slate-200 shadow-inner overflow-hidden relative z-10 bg-white">
                <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={4}
                    strokeColor="#1E293B"
                    canvasColor="white"
                />
            </div>
        </div>
    );
};

