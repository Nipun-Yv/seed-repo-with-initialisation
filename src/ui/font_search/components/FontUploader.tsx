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
            const response = await fetch("https://localhost:8443/upload-font", {
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
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Upload Custom Font</h4>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-blue-600 font-medium">
                        {uploading ? "Processing Font..." : "Click to upload .ttf or .otf"}
                    </p>
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