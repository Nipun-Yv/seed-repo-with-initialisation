import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";


import { Theme } from "@swc-react/theme";
import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";

import "../App.css";

import { AddOnSDKAPI, ClientStorage} from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { DesignResult } from "./types";
import { CanvasToolbar } from "./components/CanvasToolbar";
import { SketchCanvas } from "./components/SketchCanvas";
import { ActionFooter } from "./components/ActionFooter";
import { useNavigate } from "react-router-dom";
import {BACKEND_API_URL} from "../../utils/constants"
import {superimposeBlobs, base64ToBlob, resizeImageBlob} from "../../utils/blob_conversion"

const VariantGen = ({ addOnUISdk,store}: { addOnUISdk: AddOnSDKAPI,
    store:ClientStorage
}) => {
    const navigate=useNavigate()
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DesignResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>("");
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [brushColor, setBrushColor] = useState("#1E293B");
    const [userPrompt, setUserPrompt] = useState<string>("");
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleUndo = () => canvasRef.current?.undo();
    const handleRedo = () => canvasRef.current?.redo();
    const handleClear = () => canvasRef.current?.clearCanvas();
    const handleClearImage = () => setBackgroundImageUrl(undefined);

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setBackgroundImageUrl(reader.result);
                canvasRef.current?.clearCanvas();
            }
        };
        reader.onerror = () => setError('Failed to load image');
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
        e.target.value = ''; // Reset for re-upload
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    };
    
    const handleExport = async () => {
      if (canvasRef.current) {
        try {
          const dataUrl = await canvasRef.current.exportImage("png");
          console.log("Exported Image:", dataUrl);
        } catch (e) {
          console.error("Export failed", e);
        }
      }
    };
    const handleGenerateVariants = async () => {
        if (!canvasRef.current) {
            setError("Canvas is not available");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const dataUrl = await canvasRef.current.exportImage("png");
            const response = await fetch(dataUrl);

            let mergedBlob:Blob;

            const overlayBlob = await response.blob();
            if(backgroundImageUrl){
                const backgroundResponse = await fetch(backgroundImageUrl);
                const backgroundBlob = await backgroundResponse.blob();
                mergedBlob = await superimposeBlobs(backgroundBlob, overlayBlob);
            }
            else{
                mergedBlob=overlayBlob
            }

            const file = new File([mergedBlob], "sketch.png", { type: "image/png" });
            

            const formData = new FormData();
            formData.append("file", file);
            if (userPrompt.trim()) {
                formData.append("user_prompt", userPrompt.trim());
            }
            const sessionId = await store.getItem("session_id") as string;

            if (!sessionId) {
                navigate("/login")
            }

            const apiResponse = await fetch(`${BACKEND_API_URL}/generative/generate-designs`, {
                method: "POST",
                headers: {
                    "X-Session-ID": sessionId
                },
                body: formData,
            });

            
            if (!apiResponse.ok) {
                let errorMessage = `HTTP error! status: ${apiResponse.status}`;
                try {
                    const errorData = await apiResponse.json();
                    errorMessage = errorData.detail || errorData.message || errorMessage;
                } catch {
                    errorMessage = apiResponse.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data: DesignResult = await apiResponse.json();
            setResults(data);
        } catch (err) {
            if (err instanceof TypeError && err.message.includes("fetch")) {
                if (BACKEND_API_URL.startsWith("http://") && window.location.protocol === "https:") {
                    setError(
                        "Mixed Content Error: The frontend is on HTTPS but the backend is on HTTP."
                    );
                } else {
                    setError("Failed to connect to the API. Please check if the backend is running and the API URL is correct.");
                }
            } else {
                setError(err instanceof Error ? err.message : "Failed to generate variants");
            }
            console.error("Error generating variants:", err);
        } finally {
            setLoading(false);
        }
    };

        return (
            <Theme system="express" scale="medium" color="light" className="h-full">
                <div 
                    className={`flex flex-col h-full w-full bg-[#FAFAFA] text-slate-900 relative ${isDraggingOver ? 'ring-2 ring-indigo-500 ring-inset' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                    
                    {isDraggingOver && (
                        <div className="absolute inset-0 bg-indigo-500/10 z-50 flex items-center justify-center pointer-events-none">
                            <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-dashed border-indigo-400">
                                <p className="text-indigo-600 font-semibold">Drop image here</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex-1 flex flex-col gap-2 p-4 min-h-0 overflow-y-auto">
                        <CanvasToolbar 
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            onClear={handleClear}
                            onClearImage={handleClearImage}
                            onUploadImage={handleUploadClick}
                            selectedColor={brushColor}
                            onColorChange={setBrushColor}
                        />

                        <SketchCanvas canvasRef={canvasRef} backgroundImageUrl={backgroundImageUrl} strokeColor={brushColor} />
                    </div>

                    <ActionFooter
                        onExport={handleExport}
                        onGenerateVariants={handleGenerateVariants}
                        loading={loading}
                        error={error}
                        results={results}
                        onClearResults={() => setResults(null)}
                        userPrompt={userPrompt}
                        onUserPromptChange={setUserPrompt}
                        onImageClick={async (base64Image, isOriginal) => {
                            try {
                                console.log(`[VariantGen] Adding ${isOriginal ? 'original' : 'variant'} image to document...`);
                                const blob = base64ToBlob(base64Image, 'image/jpeg');
                                const resizedBlob = await resizeImageBlob(blob, 300);
                                await addOnUISdk.app.document.addImage(resizedBlob, {
                                    title: isOriginal ? 'Original Image' : 'Design Variant'
                                });
                                console.log('[VariantGen] Image added to document successfully');
                            } catch (err) {
                                console.error('[VariantGen] Failed to add image to document:', err);
                                setError(err instanceof Error ? err.message : 'Failed to add image to document');
                            }
                        }}
                    />
                </div>
            </Theme>
        );
};

export default VariantGen;
