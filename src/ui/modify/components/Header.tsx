import React from "react";

export const Header: React.FC = () => {
    return (
        <div className="px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                <div>
                    <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Sketch Canvas</h1>
                    <p className="text-[10px] text-slate-500 font-medium">Select any image to augment it with your own sketch</p>
                </div>
            </div>
        </div>
    );
};
