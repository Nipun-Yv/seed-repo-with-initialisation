export interface FontMatch {
    fontName: string;
    score: number;        // Semantic matching score (0-1)
    previewUrl?: string;   // URL or Base64 of the character rendered in this font
    fontFamily: string;   // The actual font-family name for CSS
    postscriptName?: string; // PostScript name for applying font in Adobe Express
}

export interface FontSearchResponse {
    identifiedLetter: string; // e.g., "A"
    matches: FontMatch[];     // Top 3-5 results
}