import React, { useState, useRef } from 'react';
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchCanvas } from './components/SketchCanvas';
import { CanvasToolbar } from './components/CanvasToolbar';
import { FontVariantsList } from './components/FontVariantsList';
import { FontSearchResponse, FontMatch } from './types';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';

interface FontSearchProps {
    sandboxProxy: DocumentSandboxApi;
}

const FontSearch: React.FC<FontSearchProps> = ({ sandboxProxy }) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<FontSearchResponse | null>(null);
    const [applyingFont, setApplyingFont] = useState(false);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(undefined);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setBackgroundImageUrl(reader.result);
            }
        };
        reader.onerror = () => {
            alert('Failed to load image');
        };
        reader.readAsDataURL(file);
        
        // Reset file input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearImage = () => {
        setBackgroundImageUrl(undefined);
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let file: File;

            // If background image exists, use it; otherwise use the sketch
            if (backgroundImageUrl) {
                // Convert background image data URL to blob
                const response = await fetch(backgroundImageUrl);
                const blob = await response.blob();
                file = new File([blob], "background.png", { type: "image/png" });
            } else {
                // Export sketch from canvas
                const dataUrl = await canvasRef.current?.exportImage("png");
                const response = await fetch(dataUrl!);
                const blob = await response.blob();
                file = new File([blob], "sketch.png", { type: "image/png" });
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("character", "A");
            formData.append("include_images", "true");

            const apiResponse = await fetch("https://localhost:8443/match-font", {
                method: "POST",
                body: formData
            });
            
            if (!apiResponse.ok) {
                throw new Error(`API error: ${apiResponse.status}`);
            }
            
            const apiData = await apiResponse.json();
            console.log("Font Match API Response:", apiData);
            console.log("Number of matches:", apiData.matches?.length || 0);
            console.log("Matches:", apiData.matches);
            console.log("Character:", apiData.character);
            
            // Transform API response to match FontSearchResponse interface
            const data: FontSearchResponse = {
                identifiedLetter: apiData.character || "A",
                matches: (apiData.matches || []).map((match: any) => ({
                    fontName: match.font_name || match.fontName,
                    fontFamily: match.font_name?.replace(/\.(ttf|otf)$/i, '') || match.fontFamily || match.fontName,
                    score: match.similarity || match.score || 0,
                    previewUrl: match.font_face_image,
                    postscriptName: match.postscript_name || match.postscriptName
                }))
            };
            
            setResults(data);
        } catch (err) {
            console.error(err);
            alert("Failed to search fonts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#FAFAFA] text-slate-900">
            <div className="flex-1 flex flex-col p-4 overflow-hidden gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <CanvasToolbar 
                    onUndo={() => canvasRef.current?.undo()} 
                    onRedo={() => canvasRef.current?.redo()} 
                    onClear={() => { canvasRef.current?.clearCanvas(); setResults(null); }}
                    onUploadImage={handleUploadClick}
                    onClearImage={backgroundImageUrl ? handleClearImage : undefined}
                />
                
                <div className="h-[250px] mt-2">
                    <SketchCanvas canvasRef={canvasRef} backgroundImageUrl={backgroundImageUrl} />
                </div>

            <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
            >
                {loading ? "Analyzing..." : "Search Fonts"}
            </button>

                {results && (
                    <FontVariantsList
                        results={results}
                        onClear={() => setResults(null)}
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
                )}

                {!results && (
                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font Matches</span>
                        </div>
                        
                        {/* Scrollable Font Container - Grid 3 columns */}
                        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-64 pb-2 pr-1">
                            {[1, 2, 3].map((i) => (
                                <div 
                                    key={i}
                                    className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group hover:border-indigo-200 transition-colors cursor-pointer"
                                >
                                    <div className="text-slate-300 group-hover:text-indigo-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FontSearch;