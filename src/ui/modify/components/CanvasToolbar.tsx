import React from "react";
import { Undo2, Redo2, Trash2, Zap, ZapOff, ImageOff, Palette } from "lucide-react";

interface CanvasToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onClearImage: () => void;
    syncSelectionEnabled: boolean;
    onSyncSelectionToggle: (enabled: boolean) => void;
    selectedColor: string;
    onColorChange: (color: string) => void;
}

const COLOR_PALETTE = [
    { name: "Dark Slate", color: "#1E293B" },
    { name: "Black", color: "#000000" },
    { name: "Red", color: "#EF4444" },
    { name: "Orange", color: "#F97316" },
    { name: "Amber", color: "#F59E0B" },
    { name: "Yellow", color: "#EAB308" },
    { name: "Green", color: "#22C55E" },
    { name: "Cyan", color: "#06B6D4" },
    { name: "Blue", color: "#3B82F6" },
    { name: "Indigo", color: "#6366F1" },
    { name: "Purple", color: "#A855F7" },
    { name: "Pink", color: "#EC4899" },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ 
    onUndo, 
    onRedo, 
    onClear,
    onClearImage,
    syncSelectionEnabled,
    onSyncSelectionToggle,
    selectedColor,
    onColorChange
}) => {
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    return (
        <div className="flex items-center justify-between w-full p-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
            {/* History Group */}
            <div className="flex items-center gap-0.5">
                <button 
                    onClick={onUndo} 
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all active:scale-95"
                    title="Undo"
                >
                    <Undo2 size={18} strokeWidth={2.5} />
                </button>
                <button 
                    onClick={onRedo} 
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all active:scale-95"
                    title="Redo"
                >
                    <Redo2 size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            {/* Sync Toggle - Compact Version */}
            <button 
                onClick={() => onSyncSelectionToggle(!syncSelectionEnabled)}
                className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all ${
                    syncSelectionEnabled 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
                title="Sync Selection"
            >
                {syncSelectionEnabled ? <Zap size={14} fill="currentColor" /> : <ZapOff size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-tight leading-none">Sync</span>
            </button>

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            {/* Color Picker */}
            <div className="relative">
                <button 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all hover:bg-slate-50 text-slate-600"
                    title="Brush Color"
                >
                    <div 
                        className="w-4 h-4 rounded border-2 border-slate-300 shadow-sm" 
                        style={{ backgroundColor: selectedColor }}
                    />
                    <Palette size={14} />
                </button>
                
                {showColorPicker && (
                    <>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowColorPicker(false)}
                        />
                        <div className="absolute right-full top-0 mr-1 flex items-center gap-1 px-2 py-1.5 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-w-[160px] overflow-x-auto scrollbar-thin">
                            {COLOR_PALETTE.map((item) => (
                                <button
                                    key={item.color}
                                    onClick={() => {
                                        onColorChange(item.color);
                                        setShowColorPicker(false);
                                    }}
                                    className={`w-7 h-7 rounded-md transition-all hover:scale-110 flex-shrink-0 ${
                                        selectedColor === item.color 
                                            ? 'ring-2 ring-indigo-500 ring-offset-1' 
                                            : 'hover:ring-2 hover:ring-slate-300'
                                    }`}
                                    style={{ backgroundColor: item.color }}
                                    title={item.name}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />

            {/* Clear Actions */}
            <div className="flex items-center gap-0.5">
                <button 
                    onClick={onClearImage} 
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
                    title="Clear Background Image"
                >
                    <ImageOff size={18} />
                </button>
                <button 
                    onClick={onClear} 
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                    title="Clear Canvas"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};