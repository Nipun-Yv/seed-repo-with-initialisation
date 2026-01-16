import React from "react";

interface PlaceholderProps {
    title?: string;
    count?: number;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ 
    title = "Suggested Variants", 
    count = 3 
}) => {
    return (
        <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
            </div>
            
            {/* Placeholder Container */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {Array.from({ length: count }).map((_, i) => (
                    <div 
                        key={i} 
                        className="flex-shrink-0 w-24 h-24 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group hover:border-indigo-200 transition-colors cursor-pointer"
                    >
                        <div className="text-slate-300 group-hover:text-indigo-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};