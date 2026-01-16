import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";


import { Theme } from "@swc-react/theme";
import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";

import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import "../App.css";

import { AddOnSDKAPI, ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { DesignResult } from "./types";
import { Header } from "./components/Header";
import { CanvasToolbar } from "./components/CanvasToolbar";
import { SketchCanvas } from "./components/SketchCanvas";
import { ActionFooter } from "./components/ActionFooter";

const API_BASE_URL = "https://localhost:8443";
const DEFAULT_BACKGROUND_IMAGE_URL = "";

const VariantGen = ({ addOnUISdk, sandboxProxy, store}: { addOnUISdk: AddOnSDKAPI; sandboxProxy: DocumentSandboxApi,
    store:ClientStorage
}) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DesignResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSelection, setHasSelection] = useState(false);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(DEFAULT_BACKGROUND_IMAGE_URL);
    const [loadingBackground, setLoadingBackground] = useState(false);
    const [syncSelectionEnabled, setSyncSelectionEnabled] = useState(false);
    const [brushColor, setBrushColor] = useState("#1E293B");
    const [userPrompt, setUserPrompt] = useState<string>("");
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
  
  
    // Helper to handle actions
    const handleUndo = () => canvasRef.current?.undo();
    const handleRedo = () => canvasRef.current?.redo();
    const handleClear = () => canvasRef.current?.clearCanvas();
    const handleClearImage = () => setBackgroundImageUrl(undefined);
    
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

    const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
        new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((result) => {
                if (result) resolve(result);
                else reject(new Error("Failed to export canvas to blob"));
            }, "image/png");
        });

    const superimposeBlobs = async (backgroundBlob: Blob, overlayBlob: Blob): Promise<Blob> => {
        const [bgBitmap, overlayBitmap]: [ImageBitmap, ImageBitmap] = await Promise.all([
            createImageBitmap(backgroundBlob),
            createImageBitmap(overlayBlob),
        ]);
    
        const canvas = document.createElement("canvas");
        canvas.width = bgBitmap.width;
        canvas.height = bgBitmap.height;
    
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not supported");
        ctx.drawImage(bgBitmap, 0, 0); 
        
        // Draw overlay (scaled to fit the background)
        ctx.drawImage(overlayBitmap, 0, 0, canvas.width, canvas.height);
    
        // 4. Export back to a Blob
   
            const x=await canvasToBlob(canvas)
            if(x instanceof Blob){
                return x;
            }
            else{
                return null;
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
            const backgroundResponse = await fetch(backgroundImageUrl);
            
            const overlayBlob = await response.blob();
            const backgroundBlob = await backgroundResponse.blob();
        
            const mergedBlob = await superimposeBlobs(backgroundBlob, overlayBlob);

            const file = new File([mergedBlob], "sketch.png", { type: "image/png" });
            

            const formData = new FormData();
            formData.append("file", file);
            if (userPrompt.trim()) {
                formData.append("user_prompt", userPrompt.trim());
            }

            const apiResponse = await fetch(`${API_BASE_URL}/generate-designs`, {
                method: "POST",
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
                if (API_BASE_URL.startsWith("http://") && window.location.protocol === "https:") {
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
  
    const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    // Enable drag and drop for variant images
    useEffect(() => {
        if (!results || !addOnUISdk) return;

        const enableDragForImages = () => {
            // Enable drag for original image container
            const originalContainer = document.getElementById('variant-container-original');
            if (originalContainer) {
                try {
                    addOnUISdk.app.enableDragToDocument(originalContainer, {
                        previewCallback: (element: HTMLElement) => {
                            const img = element.querySelector('img');
                            if (img && img.src) {
                                return new URL(img.src);
                            }
                            return new URL(`data:image/jpeg;base64,${results.original_image}`);
                        },
                        completionCallback: async (element: HTMLElement) => {
                            // Convert base64 to blob
                            const blob = base64ToBlob(results.original_image, 'image/jpeg');
                            return [{ blob }];
                        },
                    });
                } catch (error) {
                    console.error("Failed to enable drag for original image:", error);
                }
            }

            // Enable drag for each variant container
            results.design_variations.forEach((variation, index) => {
                const variantContainer = document.getElementById(`variant-container-${index}`);
                if (variantContainer) {
                    try {
                        addOnUISdk.app.enableDragToDocument(variantContainer, {
                            previewCallback: (element: HTMLElement) => {
                                const img = element.querySelector('img');
                                if (img && img.src) {
                                    return new URL(img.src);
                                }
                                return new URL(`data:image/jpeg;base64,${variation}`);
                            },
                            completionCallback: async (element: HTMLElement) => {
                                // Convert base64 to blob
                                const blob = base64ToBlob(variation, 'image/jpeg');
                                return [{ blob }];
                            },
                        });
                    } catch (error) {
                        console.error(`Failed to enable drag for variant ${index}:`, error);
                    }
                }
            });
        };

        const timer = setTimeout(() => {
            enableDragForImages();
        }, 200);

        return () => clearTimeout(timer);
    }, [results, addOnUISdk]);

    // Poll for selection state and handle image selection
    useEffect(() => {
        let lastSelectedNodeId: string | undefined = undefined;

        const checkSelection = async () => {
            try {
                const state = await sandboxProxy.getSelectionState();
                setHasSelection(state.hasSelection);

                // Only update background if sync selection is enabled
                // If an image is selected and it's a different node than before, load it as background
                const isNewImageSelection = syncSelectionEnabled && state.isImage && state.selectedNodeId && state.selectedNodeId !== lastSelectedNodeId;

                if (isNewImageSelection) {
                    setLoadingBackground(true);
                    try {
                        const imageBlob = await sandboxProxy.getSelectedImageBlob();
                        
                        if (imageBlob) {
                            // Convert blob to data URL in UI where FileReader is available
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                    setBackgroundImageUrl(reader.result);
                                }
                                setLoadingBackground(false);
                            };
                            reader.onerror = () => {
                                setLoadingBackground(false);
                            };
                            reader.readAsDataURL(imageBlob);
                        } else {
                            setLoadingBackground(false);
                        }
                    } catch (err) {
                        console.error("Failed to get selected image:", err);
                        setLoadingBackground(false);
                    }
                }

                // Update last selected node ID (reset to undefined if no image selected)
                lastSelectedNodeId = state.isImage ? state.selectedNodeId : undefined;
            } catch (err) {
                console.error("Failed to get selection state:", err);
            }
        };

        checkSelection();
        const interval = setInterval(checkSelection, 200);

        return () => clearInterval(interval);
    }, [sandboxProxy, syncSelectionEnabled]);

        return (
            <Theme system="express" scale="medium" color="light" className="h-full">
                <div className="flex flex-col h-full w-full bg-[#FAFAFA] text-slate-900 relative">
                    {/* Red dot indicator when something is selected */}
                    {hasSelection && (
                        <div className="absolute top-2 right-2 z-50 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg" />
                    )}
                    {/* <Header /> */}
                    <div className="flex-1 flex flex-col gap-2 p-4 overflow-hidden">
                        <CanvasToolbar 
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            onClear={handleClear}
                            onClearImage={handleClearImage}
                            syncSelectionEnabled={syncSelectionEnabled}
                            onSyncSelectionToggle={setSyncSelectionEnabled}
                            selectedColor={brushColor}
                            onColorChange={setBrushColor}
                        />

                        {loadingBackground && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 rounded-2xl">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm text-slate-600">Loading background image...</span>
                                </div>
                            </div>
                        )}
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
                    />
                </div>
            </Theme>
        );
};

export default VariantGen;
