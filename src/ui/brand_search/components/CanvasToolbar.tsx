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

    const iconButtonClass = "p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 active:scale-95";

    return (
        <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-1">
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
            
            {/* Left: Upload */}
            <button 
                onClick={handleUploadClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition-colors duration-150 active:scale-95"
                title="Upload Image"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload
            </button>

            {/* Center: Undo/Redo */}
            <div className="flex items-center gap-0.5">
                <button 
                    onClick={onUndo} 
                    className={iconButtonClass}
                    title="Undo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
                <button 
                    onClick={onRedo} 
                    className={iconButtonClass}
                    title="Redo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                </button>
            </div>

            {/* Right: Clear */}
            <button 
                onClick={onClear} 
                className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium rounded-md transition-colors duration-150 active:scale-95"
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