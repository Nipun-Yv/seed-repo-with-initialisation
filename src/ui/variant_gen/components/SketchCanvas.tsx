import React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface SketchCanvasProps {
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
    backgroundImageUrl?: string;
    strokeColor?: string;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ canvasRef, backgroundImageUrl, strokeColor = "#1E293B" }) => {
    return (
        <div className="flex-1 relative group">
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
                    strokeColor={strokeColor}
                    canvasColor="transparent"
                    style={
                        {
                            border:""
                        }
                    }
                />
            </div>
        </div>
    );
};
