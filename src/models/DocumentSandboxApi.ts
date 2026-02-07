export interface DocumentSandboxApi {
    createRectangle(): void;
    applyFontToSelectedText(fontPostscriptName: string): Promise<boolean>;
    // logAvailableFontIndicesFromConstants(l: number, h:number): Promise<void>
}