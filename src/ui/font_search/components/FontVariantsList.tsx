import React from "react";
import { FontSearchResponse, FontMatch } from "../types";

interface FontVariantsListProps {
    results: FontSearchResponse;
    onClear: () => void;
    onSelectFont: (font: FontMatch) => void | Promise<void>;
    isApplying?: boolean;
}

export const FontVariantsList: React.FC<FontVariantsListProps> = ({ results, onClear, onSelectFont, isApplying = false }) => {
    return (
        <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Font Matches</span>
                <button 
                    onClick={onClear}
                    className="text-[10px] text-indigo-500 font-medium hover:text-indigo-700"
                >
                    Clear All
                </button>
            </div>
            
            {/* Scrollable Font Container - Grid 3 columns */}
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-64 pb-2 pr-1">
                {results.matches.map((match, index) => (
                    <div 
                        key={match.fontName}
                        onClick={() => !isApplying && onSelectFont(match)}
                        className={`aspect-square rounded-lg border-2 ${index === 0 ? 'border-indigo-300' : 'border-slate-200'} overflow-hidden bg-white shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all flex flex-col ${
                            isApplying ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {/* Font Preview */}
                        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 p-2 relative">
                            {(() => {
                                const imageBase64 = match.previewUrl;
                                if (imageBase64) {
                                    // Handle base64 string - add data URL prefix if not already present
                                    let imageSrc = String(imageBase64);
                                    if (!imageSrc.startsWith('data:')) {
                                        imageSrc = `data:image/png;base64,${imageSrc}`;
                                    }
                                    return (
                                        <>
                                            <img 
                                                src={imageSrc}
                                                alt={`${match.fontName} - ${results.identifiedLetter}`}
                                                className="max-w-full max-h-full object-contain"
                                                draggable={false}
                                            />
                                            <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-white">
                                                <p className="text-[8px] font-medium truncate text-center">
                                                    {match.fontName}
                                                </p>
                                            </div>
                                        </>
                                    );
                                }
                                return (
                                    <span 
                                        style={{ fontFamily: match.fontFamily }} 
                                        className="text-4xl font-bold text-slate-800"
                                    >
                                        {results.identifiedLetter}
                                    </span>
                                );
                            })()}
                        </div>
                        
                        {/* Font Name */}
                        <div className="px-2 py-2 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                            <p className="text-[10px] font-semibold text-slate-900 truncate flex-1" title={match.fontName}>
                                {match.fontName}
                            </p>
                            {index === 0 && (
                                <span className="text-[8px] text-amber-600 font-bold whitespace-nowrap">BEST</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
