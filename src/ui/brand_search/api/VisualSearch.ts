import { SearchResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Your Python Backend URL

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