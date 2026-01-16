export interface DocumentSandboxApi {
    createRectangle(): void;
    getSelectionState(): Promise<{ hasSelection: boolean; selectionCount: number; isImage: boolean; selectedNodeId?: string }>;
    getSelectedImageBlob(): Promise<Blob | null>;
    applyFontToSelectedText(fontPostscriptName: string): Promise<boolean>;
}