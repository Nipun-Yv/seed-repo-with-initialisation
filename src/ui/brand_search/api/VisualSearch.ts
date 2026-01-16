import { SearchResponse } from '../types';

const API_BASE_URL = 'https://127.0.0.1:8443'; // Your Python Backend URL

export const searchBySketch = async (imageBlob: Blob): Promise<SearchResponse> => {
  const formData = new FormData();
  // 'file' must match the parameter name in your main.py: file: UploadFile
  formData.append('file', imageBlob, 'sketch.png');

  const response = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to search images');
  }

  return response.json();
};

// Helper function to get image URL from filename (from frontend photos folder)
// Images are in dist/photos folder - use relative path from current location
export const getImageUrl = (filename: string): string => {
  // Since images are in dist/photos and HTML is in dist root,
  // use relative path that works from the HTML file location
  return `photos/${filename}`;
};