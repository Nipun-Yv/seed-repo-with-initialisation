
export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
    new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
            if (result) resolve(result);
            else reject(new Error("Failed to export canvas to blob"));
        }, "image/png");
    });

export const superimposeBlobs = async (backgroundBlob: Blob, overlayBlob: Blob): Promise<Blob> => {
    const [bgBitmap, overlayBitmap]: [ImageBitmap, ImageBitmap] = await Promise.all([
        createImageBitmap(backgroundBlob),
        createImageBitmap(overlayBlob),
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = bgBitmap.width;
    canvas.height = bgBitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not supported");
    ctx.drawImage(bgBitmap, 0, 0); 
    
    // Draw overlay (scaled to fit the background)
    ctx.drawImage(overlayBitmap, 0, 0, canvas.width, canvas.height);

    // 4. Export back to a Blob

        const x=await canvasToBlob(canvas)
        if(x instanceof Blob){
            return x;
        }
        else{
            return null;
        }


};


export const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

export const resizeImageBlob = async (blob: Blob, targetWidth: number = 300): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
                URL.revokeObjectURL(url);
                
                // Calculate height maintaining aspect ratio
                const width = targetWidth;
                const height = (img.height / img.width) * targetWidth;
                
                // Create canvas and resize
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((resizedBlob) => {
                    if (resizedBlob) {
                        resolve(resizedBlob);
                    } else {
                        reject(new Error('Failed to resize image'));
                    }
                }, blob.type || 'image/jpeg', 0.9);
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };
            
            img.src = url;
        });
    }