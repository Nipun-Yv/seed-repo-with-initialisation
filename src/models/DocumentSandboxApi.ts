// This interface declares all the APIs that the document sandbox runtime ( i.e. code.ts ) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    createRectangle(): void;
    renderSvgPaths(paths: Array<{ pathData: string; translation: { x: number; y: number }; fillColor: string }>): void;
    getSelectionState(): Promise<{ hasSelection: boolean; selectionCount: number; isImage: boolean; selectedNodeId?: string }>;
    getSelectedImageBlob(): Promise<Blob | null>;
}
