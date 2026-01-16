import { SearchResponse } from '../types';

const API_BASE_URL = 'https://127.0.0.1:8443'; // Your Python Backend URL

export const searchBySketch = async (imageBlob: Blob): Promise<SearchResponse> => {
  console.log('[API] Starting searchBySketch request...');
  console.log('[API] Image blob size:', imageBlob.size, 'bytes');
  console.log('[API] Image blob type:', imageBlob.type);
  console.log('[API] Request URL:', `${API_BASE_URL}/search`);
  
  const formData = new FormData();
  // 'file' must match the parameter name in your main.py: file: UploadFile
  formData.append('file', imageBlob, 'sketch.png');
  console.log('[API] FormData created, sending request...');

  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      body: formData,
    });

    console.log('[API] Response received, status:', response.status, response.statusText);
    console.log('[API] Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Response not OK. Error text:', errorText);
      throw new Error(`Failed to search images: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('[API] Response JSON parsed successfully');
    console.log('[API] Response data:', responseData);
    console.log('[API] Response type:', typeof responseData);
    console.log('[API] Has similar_images?', 'similar_images' in responseData);
    console.log('[API] Similar images count:', responseData.similar_images?.length || 0);
    
    return responseData;
  } catch (error) {
    console.error('[API] Error in searchBySketch:', error);
    throw error;
  }
};

// Helper function to get image URL from filename (from frontend photos folder)
// Images are in dist/photos folder - use relative path from current location
export const getImageUrl = (filename: string): string => {
  // Since images are in dist/photos and HTML is in dist root,
  // use relative path that works from the HTML file location
  return `photos/${filename}`;
};