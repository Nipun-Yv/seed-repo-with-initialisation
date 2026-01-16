import React, { useState, useRef } from 'react';
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchCanvas } from './components/SketchCanvas';
import { CanvasToolbar } from './components/CanvasToolbar';
import { FontResultsList } from './components/FontResultsList';
import { FontUploader } from './components/FontUploader';
import { FontSearchResponse, FontMatch } from './types';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';

interface FontSearchProps {
    sandboxProxy: DocumentSandboxApi;
}

const FontSearch: React.FC<FontSearchProps> = ({ sandboxProxy }) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<FontSearchResponse | null>(null);
    const [applyingFont, setApplyingFont] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const dataUrl = await canvasRef.current?.exportImage("png");
            const response = await fetch(dataUrl!);
            const blob = await response.blob();
            const file = new File([blob], "sketch.png", { type: "image/png" });

            const formData = new FormData();
            formData.append("file", file);

            // ACTUAL API CALL (Phase 5)
            const apiResponse = await fetch("https://localhost:8443/search-fonts", {
                method: "POST",
                body: formData
            });
            const data: FontSearchResponse = await apiResponse.json();
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#FAFAFA] p-4 overflow-y-auto">
            <CanvasToolbar 
                onUndo={() => canvasRef.current?.undo()} 
                onRedo={() => canvasRef.current?.redo()} 
                onClear={() => { canvasRef.current?.clearCanvas(); setResults(null); }} 
            />
            
            <div className="h-[250px] mb-4 shrink-0">
                <SketchCanvas canvasRef={canvasRef} />
            </div>

            <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
            >
                {loading ? "Analyzing..." : "Search Fonts"}
            </button>

            {results && (
                <div className="mt-2 text-center">
                    <span className="text-xs font-medium text-slate-400">
                        Detected: <b className="text-blue-600 text-lg uppercase">{results.identifiedLetter}</b>
                    </span>
                    <FontResultsList 
                        matches={results.matches} 
                        identifiedLetter={results.identifiedLetter}
                        onSelectFont={async (font) => {
                            if (!font.postscriptName) {
                                alert(`Font "${font.fontName}" does not have a PostScript name. Cannot apply font.`);
                                return;
                            }
                            
                            setApplyingFont(true);
                            try {
                                const success = await sandboxProxy.applyFontToSelectedText(font.postscriptName);
                                if (success) {
                                    alert(`Font "${font.fontName}" applied successfully!`);
                                } else {
                                    alert(`Failed to apply font. Please make sure you have a text node selected.`);
                                }
                            } catch (error) {
                                console.error('Error applying font:', error);
                                alert('An error occurred while applying the font.');
                            } finally {
                                setApplyingFont(false);
                            }
                        }}
                        isApplying={applyingFont}
                    />
                </div>
            )}

            <FontUploader onUploadSuccess={(name) => console.log("New font available:", name)} />
        </div>
    );
};

export default FontSearch;