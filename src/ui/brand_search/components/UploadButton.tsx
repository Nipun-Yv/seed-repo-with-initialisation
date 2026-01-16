import React, { useRef } from "react";

interface UploadButtonProps {
    onUpload: (files: FileList) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onUpload(files);
        }
        // Reset input to allow re-uploading same folder
        e.target.value = "";
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                /* @ts-ignore */
                webkitdirectory=""
                directory=""
                className="hidden"
                onChange={handleChange}
            />
            <button
                onClick={handleClick}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Upload Folder
            </button>
        </>
    );
};