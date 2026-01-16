import React from "react";
import { DesignResult } from "../types";
import { VariantsList } from "./VariantsList";

interface ActionFooterProps {
    onExport: () => void;
    onGenerateVariants: () => void;
    loading: boolean;
    error: string | null;
    results: DesignResult | null;
    onClearResults: () => void;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
    onExport,
    onGenerateVariants,
    loading,
    error,
    results,
    onClearResults,
}) => {
    return (
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            {/* Primary Action */}
            {/* <button 
                onClick={onExport} 
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md font-bold text-sm active:scale-[0.98]"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Add to Express
            </button> */}

            {/* AI Variant Button */}
            <button 
                onClick={onGenerateVariants}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-700 rounded-xl transition-all hover:border-indigo-300 font-semibold text-xs active:scale-[0.98] ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                        Generate Variants
                    </>
                )}
            </button>

            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}


            {results && <VariantsList results={results} onClear={onClearResults} />}

            
            {!results && (
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Variants</span>
                    </div>
                    
                    {/* Scrollable Variant Container */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex-shrink-0 w-24 h-24 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group hover:border-indigo-200 transition-colors cursor-pointer">
                                <div className="text-slate-300 group-hover:text-indigo-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
