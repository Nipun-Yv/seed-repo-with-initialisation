import { SearchResponse } from '../types';

const API_BASE_URL = 'https://search.api-easy-eats-canteen.sbs'; // Your Python Backend URL

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

// Store files to backend storage endpoint
// Using same format as canvas search (single 'file' key)
export const storeFiles = async (files: FileList): Promise<any> => {
  console.log('[API] ========== storeFiles FUNCTION CALLED ==========');
  console.log('[API] Starting storeFiles request...');
  console.log('[API] Number of files:', files.length);
  console.log('[API] Request URL:', `${API_BASE_URL}/store`);
  console.log('[API] API_BASE_URL:', API_BASE_URL);
  
  // Convert FileList to array
  const fileArray: File[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file instanceof File) {
      fileArray.push(file);
    }
  }

  // Try sending all files in one request with 'files' key (plural) or multiple 'file' keys
  // First, let's try the same format as canvas but with all files
  const formData = new FormData();
  
  // Option 1: Try appending all files with 'file' key (some backends accept multiple with same key)
  fileArray.forEach((file: File, index: number) => {
    console.log(`[API] Adding file ${index + 1}/${fileArray.length} to FormData: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    // Try 'file' key like canvas search
    formData.append('file', file, file.name);
  });
  
  console.log(`[API] FormData created with ${fileArray.length} files, sending request...`);
  console.log(`[API] About to call fetch...`);
  console.log(`[API] Fetch URL: ${API_BASE_URL}/store`);
  console.log(`[API] Fetch method: POST`);
  console.log(`[API] Files being sent:`, fileArray.map(f => `${f.name} (${f.size} bytes, ${f.type})`));

  try {
    console.log(`[API] ========== FETCH CALL STARTING ==========`);
    const response = await fetch(`${API_BASE_URL}/store`, {
      method: 'POST',
      body: formData,
    });
    console.log(`[API] ========== FETCH CALL COMPLETED ==========`);

    console.log(`[API] Store response status:`, response.status, response.statusText);
    console.log(`[API] Response ok:`, response.ok);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.error(`[API] Store response not OK. Status:`, response.status);
          console.error(`[API] Error response text:`, errorText);
          console.error(`[API] Response status text:`, response.statusText);
        } catch (e) {
          console.error(`[API] Could not read error response:`, e);
        }
        throw new Error(`Failed to store files: ${response.status} ${response.statusText}. ${errorText}`);
      }

    const responseData = await response.json();
    console.log(`[API] Store response JSON parsed successfully`);
    console.log(`[API] Store response data:`, responseData);
    
    console.log('[API] All files stored successfully');
    return { success: true, response: responseData };
  } catch (error) {
    console.error(`[API] Error storing files:`, error);
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