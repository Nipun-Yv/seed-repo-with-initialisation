import React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface SketchCanvasProps {
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
    backgroundImageUrl?: string;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ canvasRef, backgroundImageUrl }) => {
    return (
        <div className="h-full w-full relative">
            <div 
                className="h-full w-full rounded-2xl border-2 border-slate-200 shadow-inner overflow-hidden relative z-10"
                style={{
                    backgroundImage: backgroundImageUrl && backgroundImageUrl.length > 0 ? `url(${backgroundImageUrl})` : 'none',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: backgroundImageUrl && backgroundImageUrl.length > 0 ? 'transparent' : 'white'
                }}
            >
                <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={4}
                    strokeColor="#1E293B"
                    canvasColor="transparent"
                    style={{
                        border:""
                    }}
                />
            </div>
        </div>
    );
};

