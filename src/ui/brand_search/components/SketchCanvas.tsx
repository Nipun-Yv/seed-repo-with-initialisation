import React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface SketchCanvasProps {
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ canvasRef }) => {
    return (
        <div className="flex-1 relative group min-h-[180px]">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-violet-200 to-pink-200 rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            
            {/* Canvas container */}
            <div className="absolute inset-[2px] rounded-[14px] bg-white shadow-inner overflow-hidden">
                <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={3}
                    strokeColor="#000000"
                    canvasColor="white"
                />
            </div>
            
            {/* Corner hint */}
            <div className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Draw here
            </div>
        </div>
    );
};