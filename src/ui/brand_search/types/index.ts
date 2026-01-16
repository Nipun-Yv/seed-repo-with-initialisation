export interface SearchMatch {
    rank: number;
    filename: string;
    similarity_score: number;
    url: string;
  }
  
  export interface SearchResponse {
    matches: SearchMatch[];
  }