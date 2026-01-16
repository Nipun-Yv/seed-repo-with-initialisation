import React, { useRef } from "react";

interface CanvasToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onUpload: (files: FileList) => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onUndo, onRedo, onClear, onUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onUpload(files);
        }
        e.target.value = "";
    };

    return (
        <div className="flex items-center justify-between p-1 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/80 shadow-sm backdrop-blur-sm">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                /* @ts-ignore */
                webkitdirectory=""
                directory=""
                className="hidden"
                onChange={handleFileChange}
            />
            
            {/* Left: Upload Button */}
            <button 
                onClick={handleUploadClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white text-[11px] font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                title="Upload Folder"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Upload
            </button>

            {/* Center: Drawing Tools */}
            <div className="flex items-center gap-0.5 px-2">
                <button 
                    onClick={onUndo} 
                    className="p-1.5 hover:bg-white/80 text-slate-500 hover:text-indigo-600 rounded-lg transition-all duration-200 active:scale-90"
                    title="Undo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
                <button 
                    onClick={onRedo} 
                    className="p-1.5 hover:bg-white/80 text-slate-500 hover:text-indigo-600 rounded-lg transition-all duration-200 active:scale-90"
                    title="Redo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                </button>
            </div>

            {/* Right: Clear Button */}
            <button 
                onClick={onClear} 
                className="flex items-center gap-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-500 text-[11px] font-semibold rounded-lg transition-all duration-200 active:scale-95"
                title="Clear Canvas"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
            </button>
        </div>
    );
};