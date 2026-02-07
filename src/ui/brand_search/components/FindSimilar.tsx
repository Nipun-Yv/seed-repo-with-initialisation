import React from "react";
import { SearchResponse, SimilarImage } from "../types";
import { getImageUrl } from "../api/VisualSearch";

interface FindSimilarProps {
    onFindSimilar: () => void;
    loading: boolean;
    error: string | null;
    results: SearchResponse | null;
    onClearResults: () => void;
    onImageClick?: (imageUrl: string) => void;
    uploadedImages?: string[];
}

export const FindSimilar: React.FC<FindSimilarProps> = ({
    onFindSimilar,
    loading,
    error,
    results,
    onClearResults,
    onImageClick,
    uploadedImages = [],
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
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            {/* Find Similar Button */}
            <button 
                onClick={onFindSimilar}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md active:scale-[0.98] ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Searching...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search Your Saves
                    </>
                )}
            </button>

            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}

            {/* Results Display */}
            {results && results.similar_images && results.similar_images.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {results.similar_images.length} Matches Found
                        </span>
                        <button 
                            onClick={onClearResults}
                            className="text-[10px] text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                        >
                            Clear results
                        </button>
                    </div>
                    
                    {/* Results Grid - Horizontal Layout */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {results.similar_images.map((match: SimilarImage, index: number) => {
                            // Use cloudinary_url if available, otherwise fallback to getImageUrl
                            const imageUrl = match.cloudinary_url || getImageUrl(match.filename);
                            const similarity = (match.similarity * 100).toFixed(0);
                            console.log(`[FindSimilar] Rendering image ${index + 1}: ${match.filename} from URL: ${imageUrl}`);
                            const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
                                src: imageUrl,
                                alt: match.filename,
                                className: "w-full h-full object-contain p-1",
                                draggable: false,
                                onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    console.error(`[FindSimilar] Failed to load image: ${imageUrl}`, e);
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                },
                                onLoad: () => {
                                    console.log(`[FindSimilar] Successfully loaded image: ${imageUrl}`);
                                }
                            };
                            return (
                                <div 
                                    key={index}
                                    onClick={() => onImageClick?.(imageUrl)}
                                    className="relative flex-shrink-0 w-20 h-20 aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-150 group"
                                    title={`${match.filename} - ${similarity}% match - Click to add to document`}
                                >
                                    <img {...imgProps} />
                                    {/* Similarity badge */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        <span className="block text-center text-[9px] text-white font-medium py-1">
                                            {similarity}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State or Uploaded Images */}
            {!results && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            Results
                        </span>
                    </div>
                    
                    {/* Show uploaded images if available, otherwise show placeholders */}
                    {uploadedImages.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {uploadedImages.slice(0, 5).map((imageUrl, index) => {
                                const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
                                    src: imageUrl,
                                    alt: `Uploaded ${index + 1}`,
                                    className: "w-full h-full object-cover",
                                    draggable: false,
                                    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        const target = e.currentTarget;
                                        target.style.display = 'none';
                                    }
                                };
                                return (
                                    <div 
                                        key={`uploaded-${index}-${imageUrl.slice(-10)}`}
                                        onClick={() => onImageClick?.(imageUrl)}
                                        className="relative flex-shrink-0 w-20 h-20 aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-150"
                                        title={`Uploaded image ${index + 1} - Click to add to document`}
                                    >
                                        <img {...imgProps} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div 
                                    key={i} 
                                    className="flex-shrink-0 w-20 h-20 aspect-square rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};