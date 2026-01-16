import React from "react";
import { Undo2, Redo2, Trash2, Upload, ImageOff } from "lucide-react";

interface CanvasToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onUploadImage: () => void;
    onClearImage?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onUndo, onRedo, onClear, onUploadImage, onClearImage }) => {
    return (
        <div className="flex items-center justify-between w-full p-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
            {/* History Group */}
            <div className="flex items-center gap-0.5">
                <button 
                    onClick={onUndo} 
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all active:scale-95"
                    title="Undo"
                >
                    <Undo2 size={18} strokeWidth={2.5} />
                </button>
                <button 
                    onClick={onRedo} 
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all active:scale-95"
                    title="Redo"
                >
                    <Redo2 size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            {/* Upload Image Button */}
            <button 
                onClick={onUploadImage}
                className="flex items-center gap-1.5 px-2 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all active:scale-95"
                title="Upload Image"
            >
                <Upload size={14} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-tight leading-none">Image</span>
            </button>

            {/* Clear Image Button (only show if image is uploaded) */}
            {onClearImage && (
                <>
                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                    <button 
                        onClick={onClearImage} 
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                        title="Clear Background Image"
                    >
                        <ImageOff size={18} />
                    </button>
                </>
            )}

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            {/* Clear Actions */}
            <button 
                onClick={onClear} 
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                title="Clear Canvas"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};
