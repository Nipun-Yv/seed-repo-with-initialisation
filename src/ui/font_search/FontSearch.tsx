import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchCanvas } from "./components/SketchCanvas";
import { CanvasToolbar } from "./components/CanvasToolbar";
import { FontVariantsList } from "./components/FontVariantsList";
import { FontSearchResponse } from "./types";
import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import { BACKEND_API_URL } from "../../utils/constants";
import { superimposeBlobs } from "../../utils/blob_conversion";
import { ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { useNavigate } from "react-router-dom";

interface FontSearchProps {
  sandboxProxy: DocumentSandboxApi;
  store: ClientStorage;
}

const FontSearch: React.FC<FontSearchProps> = ({ sandboxProxy, store }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FontSearchResponse | null>(null);
  const [applyingFont, setApplyingFont] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<
    string | undefined
  >(undefined);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchesRemaining, setSearchesRemaining] = useState<number | null>(
    null,
  );
  const [quotaLoading, setQuotaLoading] = useState(false);
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        setQuotaLoading(true);
        const sessionId = (await store.getItem("session_id")) as string;
        if (!sessionId) {
          navigate("/login");
        }

        const res = await fetch(`${BACKEND_API_URL}/font/quota`, {
          method: "GET",
          headers: { "X-Session-ID": sessionId },
        });

        if (!res.ok) throw new Error(`Quota API error: ${res.status}`);

        const data = await res.json();
        setSearchesRemaining(data.limit - data.used);
      } catch (e) {
        console.error(e);
        setSearchesRemaining(null);
      } finally {
        setQuotaLoading(false);
      }
    };
    fetchQuota();
  }, [results]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      console.log("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        canvasRef.current?.clearCanvas();
        setBackgroundImageUrl(reader.result);
      }
    };
    reader.onerror = () => {
      console.log("Failed to load image");
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setBackgroundImageUrl(undefined);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let file: File;

      const sessionId = (await store.getItem("session_id")) as string;

      if (!sessionId) {
        navigate("/login");
      }

      // const dataUrl = await canvasRef.current?.exportImage("png");
      // const response = await fetch(dataUrl!);
      // const sketchBlob = await response.blob();
      // let mergedBlob:Blob

      // if (backgroundImageUrl!=undefined) {
      //     const response = await fetch(backgroundImageUrl);
      //     const imageBlob = await response.blob();
      //     mergedBlob=await superimposeBlobs(imageBlob,sketchBlob)
      // }

      // file = new File([mergedBlob], "background.png", { type: "image/png" });
      if (backgroundImageUrl) {
        // Convert background image data URL to blob
        const response = await fetch(backgroundImageUrl);
        const blob = await response.blob();
        file = new File([blob], "background.png", { type: "image/png" });
      } else {
        // Export sketch from canvas
        const dataUrl = await canvasRef.current?.exportImage("png");
        const response = await fetch(dataUrl!);
        const blob = await response.blob();
        file = new File([blob], "sketch.png", { type: "image/png" });
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("character", "A");
      formData.append("include_images", "true");

      const apiResponse = await fetch(`${BACKEND_API_URL}/font/match-font`, {
        method: "POST",
        headers: {
          "X-Session-ID": sessionId,
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const apiData = await apiResponse.json();
      console.log("Font Match API Response:", apiData);
      console.log("Number of matches:", apiData.matches?.length || 0);
      console.log("Matches:", apiData.matches);
      console.log("Character:", apiData.character);

      const data: FontSearchResponse = {
        identifiedLetter: apiData.character || "A",
        matches: (apiData.matches || []).map((match: any) => ({
          fontName: match.font_name || match.fontName,
          fontFamily:
            match.font_name?.replace(/\.(ttf|otf)$/i, "") ||
            match.fontFamily ||
            match.fontName,
          score: match.similarity || match.score || 0,
          previewUrl: match.font_face_image,
          postscriptName: match.postscript_name || match.postscriptName,
        })),
      };
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFA] text-slate-900">
      <div className="flex-1 flex flex-col p-4 min-h-0 overflow-y-auto gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <CanvasToolbar
          onUndo={() => canvasRef.current?.undo()}
          onRedo={() => canvasRef.current?.redo()}
          onClear={() => {
            canvasRef.current?.clearCanvas();
            setResults(null);
          }}
          onUploadImage={handleUploadClick}
          onClearImage={backgroundImageUrl ? handleClearImage : undefined}
        />

        <div className="h-52 shrink-0 mt-2">
          <SketchCanvas
            canvasRef={canvasRef}
            backgroundImageUrl={backgroundImageUrl}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`shrink-0 flex items-center justify-center gap-2 px-5 py-3  text-[#4069fd] border rounded-lg font-thin text-xs transition-all shadow-md active:scale-[0.98] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <span>Search Fonts</span>
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
              "Search Quota Unavailable"
            ) : (
              `${searchesRemaining} searches left`
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="h-10 rounded-lg bg-[#4069fd] text-white text-xs font-semibold shadow-sm active:scale-[0.98] transition-all"
          >
            Purchase more
          </button>
        </div>

        {results && (
          <FontVariantsList
            results={results}
            selectedKey={selectedKey}
            onClear={() => {
              setResults(null);
              setSelectedKey(null);
            }}
            onSelectFont={async (font) => {
              setSelectedKey(font.fontFamily ?? font.fontName);
              if (!font.fontFamily) {
                console.log(
                  `Font "${font.fontName}" does not have a PostScript name. Cannot apply font.`,
                );
                return;
              }

              setApplyingFont(true);
              try {
                const success = await sandboxProxy.applyFontToSelectedText(
                  font.fontFamily,
                );
                if (success) {
                  console.log(`Font "${font.fontName}" applied successfully!`);
                } else {
                  console.log(
                    `Failed to apply font. Please make sure you have a text node selected.`,
                  );
                }
              } catch (error) {
                console.error("Error applying font:", error);
                console.log("An error occurred while applying the font.");
              } finally {
                setApplyingFont(false);
              }
            }}
            isApplying={applyingFont}
          />
        )}

        {!results && (
          <div className="pt-2 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Font Matches
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pb-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group hover:border-indigo-200 transition-colors cursor-pointer"
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
                        d="M4 6h16M4 12h16M4 18h7"
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

export default FontSearch;
