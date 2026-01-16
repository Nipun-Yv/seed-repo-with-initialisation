import React from "react";

interface CanvasToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onUndo, onRedo, onClear }) => {
    return (
        <div className="flex items-center justify-between mb-3 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1">
                <button 
                    onClick={onUndo} 
                    className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all active:scale-95"
                    title="Undo"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
                <button 
                    onClick={onRedo} 
                    className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-all active:scale-95"
                    title="Redo"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                </button>
            </div>
            <div className="h-6 w-[1px] bg-slate-200 mx-1" />
            <button 
                onClick={onClear} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear Canvas"
            >
                <span className="text-xs font-semibold">Clear</span>
            </button>
        </div>
    );
};
