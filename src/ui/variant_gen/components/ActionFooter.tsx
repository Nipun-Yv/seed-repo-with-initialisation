import React from "react";
import { DesignResult } from "../types";
import { VariantsList } from "./VariantsList";

interface ActionFooterProps {
    searchesRemaining:number;
    quotaLoading:boolean;
  onGenerateVariants: () => void;
  loading: boolean;
  error: string | null;
  results: DesignResult | null;
  onClearResults: () => void;
  userPrompt: string;
  onUserPromptChange: (prompt: string) => void;
  onImageClick?: (base64Image: string, isOriginal: boolean) => void;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  searchesRemaining,
  quotaLoading,
  onGenerateVariants,
  loading,
  error,
  results,
  onClearResults,
  userPrompt,
  onUserPromptChange,
  onImageClick,
}) => {
    
  return (
    <div className="bg-white border-t border-slate-200 overflow-y-auto">
      <div className="p-2.5 space-y-2">
        {/* User Prompt Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 block">
            Optional Prompt
          </label>
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => onUserPromptChange(e.target.value)}
            placeholder="Describe enhancements..."
            disabled={loading}
            className="w-full px-2 py-3 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          />
        </div>

        {/* AI Variant Button */}
        <button
          onClick={onGenerateVariants}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 text-indigo-700 rounded-lg transition-all hover:border-indigo-300 font-semibold text-[11px] active:scale-[0.98] ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              Generate Variants
            </>
          )}
        </button>
        <div className="shrink-0 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled
            className="h-10 rounded-lg shadow-md bg-white text-slate-400 text-xs font-thin flex items-center justify-center gap-2"
          >
            {quotaLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                <span>Loading quota…</span>
              </>
            ) : searchesRemaining === null ? (
              "Request Quota Unavailable"
            ) : (
              `${searchesRemaining} requests left`
            )}
          </button>
          <button
            type="button"
            onClick={() => {}}
            className="h-10 rounded-lg bg-[#4069fd] text-white text-xs font-semibold shadow-sm active:scale-[0.98] transition-all"
          >
            Purchase more
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[11px] text-red-600">{error}</p>
          </div>
        )}

        {results && (
          <VariantsList
            results={results}
            onClear={onClearResults}
            onImageClick={onImageClick}
          />
        )}

        {!results && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Suggested Variants
              </span>
            </div>

            {/* Scrollable Variant Container */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-20 h-20 rounded-md bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group hover:border-indigo-200 transition-colors cursor-pointer"
                >
                  <div className="text-slate-300 group-hover:text-indigo-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
