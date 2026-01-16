import React from 'react';
import { FontMatch } from '../types';

interface FontResultsListProps {
    matches: FontMatch[];
    identifiedLetter: string;
    onSelectFont: (font: FontMatch) => void | Promise<void>;
    isApplying?: boolean;
}

export const FontResultsList: React.FC<FontResultsListProps> = ({ matches, identifiedLetter, onSelectFont, isApplying = false }) => {
    return (
        <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Top Matches for "{identifiedLetter}"
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">{matches.length} fonts</span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2">
                {matches.map((match, index) => (
                    <div 
                        key={match.fontName}
                        className={`group relative bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all ${
                            isApplying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        onClick={() => !isApplying && onSelectFont(match)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900 mb-0.5">{match.fontName}</p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                    {(match.score * 100).toFixed(1)}% Match
                                </p>
                            </div>
                            {index === 0 && (
                                <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ml-2">
                                    Best
                                </span>
                            )}
                        </div>

                        {/* Preview Area */}
                        <div className="h-20 flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-lg border border-slate-200 group-hover:from-indigo-50 group-hover:to-violet-50/30 transition-all">
                            <span 
                                style={{ fontFamily: match.fontFamily }} 
                                className="text-5xl text-slate-800 font-bold"
                            >
                                {identifiedLetter}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-end">
                            <button 
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50 flex items-center gap-1"
                                disabled={isApplying}
                            >
                                {isApplying ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        Applying...
                                    </>
                                ) : (
                                    <>
                                        Apply to Design
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};