// This interface declares all the APIs that the document sandbox runtime ( i.e. code.ts ) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    createRectangle(): void;
    renderSvgPaths(paths: Array<{ pathData: string; translation: { x: number; y: number }; fillColor: string }>): void;
    createPageAndRenderSvgPaths(
        dimensions: { width: number; height: number },
        paths: Array<{ pathData: string; translation: { x: number; y: number }; fillColor: string }>
    ): void;
    createPageAndRenderImageSegments(
        dimensions: { width: number; height: number },
        segments: Array<{ imageBase64: string; x: number; y: number; width: number; height: number; center_x: number; center_y: number }>
    ): Promise<void>;
    applyFontToText(fontFamily: string): Promise<{ success: boolean; message: string; fontFamily?: string }>;
}
