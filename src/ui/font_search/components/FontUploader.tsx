import React, { useState } from 'react';

interface FontUploaderProps {
    onUploadSuccess: (fontName: string) => void;
}

export const FontUploader: React.FC<FontUploaderProps> = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("font_file", file);

        try {
            // Replace with your actual endpoint for creating embeddings
            const response = await fetch("https://modify.api-easy-eats-canteen.sbs/upload-font", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                onUploadSuccess(file.name);
                alert(`Font "${file.name}" uploaded and vectorized successfully!`);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Upload Custom Font</h4>
            </div>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-indigo-700 font-medium">Processing Font...</p>
                        </div>
                    ) : (
                        <>
                            <svg className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-xs text-indigo-700 font-medium">
                                Click to upload .ttf or .otf
                            </p>
                        </>
                    )}
                </div>
                <input 
                    type="file" 
                    className="hidden" 
                    accept=".ttf,.otf" 
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>
        </div>
    );
};