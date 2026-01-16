import React from "react";
import { DesignResult } from "../types";

interface VariantsListProps {
    results: DesignResult;
    onClear: () => void;
}

export const VariantsList: React.FC<VariantsListProps> = ({ results, onClear }) => {
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
            
            {/* Scrollable Variant Container */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {/* Original Image */}
                <div 
                    id="variant-container-original"
                    className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-indigo-300 overflow-hidden bg-white shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
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
                        className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-slate-200 overflow-hidden bg-white shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md transition-all"
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
