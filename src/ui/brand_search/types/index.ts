export interface SimilarImage {
  filename: string;
  similarity: number;
  filepath: string | null;
}

export interface QueryImage {
  original_filename: string;
  saved_filename: string;
  saved_path: string;
  content_type: string;
  size: number;
}

export interface SearchResponse {
  message: string;
  query: string;
  query_image: QueryImage;
  similar_images: SimilarImage[];
  total_results: number;
  uploaded_at: string;
}