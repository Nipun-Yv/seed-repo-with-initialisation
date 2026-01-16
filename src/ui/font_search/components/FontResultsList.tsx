import React from 'react';
import { FontMatch } from '../types';

interface FontResultsListProps {
    matches: FontMatch[];
    identifiedLetter: string;
    onSelectFont: (font: FontMatch) => void;
}

export const FontResultsList: React.FC<FontResultsListProps> = ({ matches, identifiedLetter, onSelectFont }) => {
    return (
        <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Top Matches for "{identifiedLetter}"
                </h3>
                <span className="text-xs text-slate-400">{matches.length} fonts found</span>
            </div>
            
            {matches.map((match, index) => (
                <div 
                    key={match.fontName}
                    className="group relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-400 transition-all cursor-pointer"
                    onClick={() => onSelectFont(match)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{match.fontName}</p>
                            <p className="text-[10px] text-slate-500 font-medium">
                                {(match.score * 100).toFixed(1)}% Match
                            </p>
                        </div>
                        {index === 0 && (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                BEST MATCH
                            </span>
                        )}
                    </div>

                    {/* Preview Area */}
                    <div className="h-16 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 group-hover:bg-blue-50 transition-colors">
                        <span 
                            style={{ fontFamily: match.fontFamily }} 
                            className="text-4xl text-slate-800"
                        >
                            {identifiedLetter}
                        </span>
                    </div>

                    <div className="mt-3 flex justify-end">
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            Apply to Design →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};