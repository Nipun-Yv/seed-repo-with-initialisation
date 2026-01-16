import React from "react";
import { SearchResponse, SimilarImage } from "../types";
import { getImageUrl } from "../api/VisualSearch";

interface FindSimilarProps {
    onFindSimilar: () => void;
    loading: boolean;
    error: string | null;
    results: SearchResponse | null;
    onClearResults: () => void;
}

export const FindSimilar: React.FC<FindSimilarProps> = ({
    onFindSimilar,
    loading,
    error,
    results,
    onClearResults,
}) => {
    // Console logs for debugging
    React.useEffect(() => {
        console.log('[FindSimilar] Component rendered');
        console.log('[FindSimilar] Loading:', loading);
        console.log('[FindSimilar] Error:', error);
        console.log('[FindSimilar] Results:', results);
        console.log('[FindSimilar] Results type:', typeof results);
        console.log('[FindSimilar] Has results?', !!results);
        console.log('[FindSimilar] Results keys:', results ? Object.keys(results) : 'null');
        console.log('[FindSimilar] Similar images:', results?.similar_images);
        console.log('[FindSimilar] Similar images length:', results?.similar_images?.length || 0);
    }, [loading, error, results]);

    return (
        <div className="px-3 pb-3 pt-2 bg-gradient-to-t from-slate-100/50 to-transparent space-y-2">
            {/* Find Similar Button */}
            <button 
                onClick={onFindSimilar}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl transition-all duration-300 font-semibold text-xs shadow-md hover:shadow-lg active:scale-[0.98] ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
                {loading ? (
                    <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Searching...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Find Similar
                    </>
                )}
            </button>

            {/* Error Display */}
            {error && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg">
                    <p className="text-[10px] text-rose-600 font-medium">{error}</p>
                </div>
            )}

            {/* Results Display */}
            {results && results.similar_images && results.similar_images.length > 0 && (
                <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Similar Matches</span>
                        <button 
                            onClick={onClearResults}
                            className="text-[9px] text-indigo-500 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                    
                    {/* Scrollable Results Container */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {results.similar_images.map((match: SimilarImage, index: number) => {
                            const imageUrl = getImageUrl(match.filename);
                            return (
                                <div 
                                    key={index}
                                    className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-slate-200 overflow-hidden bg-white shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md hover:scale-105 transition-all duration-200"
                                    title={`${match.filename} - ${(match.similarity * 100).toFixed(0)}%`}
                                >
                                    <img 
                                        src={imageUrl}
                                        alt={match.filename}
                                        className="w-full h-full object-contain"
                                        draggable={false}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!results && (
                <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Results Preview</span>
                    </div>
                    
                    {/* Placeholder Container */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {[1, 2, 3, 4].map((i) => (
                            <div 
                                key={i} 
                                className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center group hover:border-indigo-300 hover:from-indigo-50 hover:to-violet-50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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