import React from "react";
import { DesignResult } from "../types";

interface VariantsListProps {
    results: DesignResult;
    onClear: () => void;
    onImageClick?: (base64Image: string, isOriginal: boolean) => void;
}

export const VariantsList: React.FC<VariantsListProps> = ({ results, onClear, onImageClick }) => {
    return (
        <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generated Variants</span>
                <button 
                    onClick={onClear}
                    className="text-[10px] text-indigo-500 font-medium hover:text-indigo-700"
                >
                    Clear All
                </button>
            </div>
            
            {/* Scrollable Variant Container - Grid 3 columns */}
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-64 pb-2 pr-1">
                {/* Original Image */}
                <div 
                    id="variant-container-original"
                    className="aspect-square rounded-lg border-2 border-indigo-300 overflow-hidden bg-white shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all active:scale-[0.98]"
                    onClick={() => onImageClick?.(results.original_image, true)}
                    title="Click to add to document"
                >
                    <img 
                        src={`data:image/jpeg;base64,${results.original_image}`}
                        alt="Original"
                        className="w-full h-full object-contain"
                        draggable={false}
                    />
                </div>
                
                {/* Design Variations */}
                {results.design_variations.map((variation, index) => (
                    <div 
                        id={`variant-container-${index}`}
                        key={index}
                        className="aspect-square rounded-lg border-2 border-slate-200 overflow-hidden bg-white shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md hover:scale-[1.02] transition-all active:scale-[0.98]"
                        onClick={() => onImageClick?.(variation, false)}
                        title="Click to add to document"
                    >
                        <img 
                            src={`data:image/jpeg;base64,${variation}`}
                            alt={`Variant ${index + 1}`}
                            className="w-full h-full object-contain"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
