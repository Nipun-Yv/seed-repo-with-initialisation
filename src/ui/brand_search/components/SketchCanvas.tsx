import React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface SketchCanvasProps {
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ canvasRef }) => {
    return (
        <div className="relative flex-1 min-h-[250px] bg-white rounded-lg border border-slate-200 overflow-hidden group">
            {/* Canvas */}
            <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={2.5}
                strokeColor="#1e293b"
                canvasColor="white"
                style={{
                    border: "none"
                }}
            />
            
            {/* Subtle grid pattern overlay */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #64748b 1px, transparent 1px),
                        linear-gradient(to bottom, #64748b 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
            />
            
            {/* Draw hint */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="px-2 py-1 bg-slate-800/75 text-white text-[10px] font-medium rounded-full">
                    Sketch your brand logo
                </span>
            </div>
        </div>
    );
};