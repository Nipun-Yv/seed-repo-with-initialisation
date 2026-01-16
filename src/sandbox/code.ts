import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, fonts } from "express-document-sdk";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

function start(): void {
    // APIs to be exposed to the UI runtime
    // i.e., to the `App.tsx` file of this add-on.
    const sandboxApi: DocumentSandboxApi = {
        createRectangle: () => {
            const rectangle = editor.createRectangle();

            // Define rectangle dimensions.
            rectangle.width = 240;
            rectangle.height = 180;

            // Define rectangle position.
            rectangle.translation = { x: 10, y: 10 };

            // Define rectangle color.
            const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };

            // Fill the rectangle with the color.
            const rectangleFill = editor.makeColorFill(color);
            rectangle.fill = rectangleFill;

            // Add the rectangle to the document.
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        },
        renderSvgPaths: (paths: Array<{ pathData: string; translation: { x: number; y: number }; fillColor: string }>) => {
            if (!paths || paths.length === 0) {
                console.warn("No SVG paths provided");
                return;
            }

            // Create a group to hold all the paths
            const group = editor.createGroup();
            
            // Create a path node for each SVG path object
            const pathNodes = paths.map((pathObj, index) => {
                try {
                    const pathNode = editor.createPath(pathObj.pathData);
                    
                    // Parse hex color to RGB
                    const hexColor = pathObj.fillColor.replace('#', '');
                    const r = parseInt(hexColor.substring(0, 2), 16) / 255;
                    const g = parseInt(hexColor.substring(2, 4), 16) / 255;
                    const b = parseInt(hexColor.substring(4, 6), 16) / 255;
                    const color = { red: r, green: g, blue: b, alpha: 1 };
                    
                    // Apply the fill color from the payload
                    pathNode.fill = editor.makeColorFill(color);
                    
                    // Use the translation from the payload
                    pathNode.translation = pathObj.translation;
                    
                    return pathNode;
                } catch (error) {
                    console.error(`Error creating path at index ${index}:`, error);
                    return null;
                }
            }).filter((node): node is NonNullable<typeof node> => node !== null);

            // Add all paths to the group
            if (pathNodes.length > 0) {
                group.children.append(...pathNodes);
                
                // Add the group to the document
                const insertionParent = editor.context.insertionParent;
                insertionParent.children.append(group);
            }
        },
        createPageAndRenderSvgPaths: (
            dimensions: { width: number; height: number },
            paths: Array<{ pathData: string; translation: { x: number; y: number }; fillColor: string }>
        ) => {
            if (!paths || paths.length === 0) {
                console.warn("No SVG paths provided");
                return;
            }

            // Create a new page with the specified dimensions
            const newPage = editor.documentRoot.pages.addPage(dimensions);
            console.log("Created new page:", newPage.width, "x", newPage.height);

            // Create a group to hold all the paths
            const group = editor.createGroup();
            
            // Create a path node for each SVG path object
            const pathNodes = paths.map((pathObj, index) => {
                try {
                    const pathNode = editor.createPath(pathObj.pathData);
                    
                    // Parse hex color to RGB
                    const hexColor = pathObj.fillColor.replace('#', '');
                    const r = parseInt(hexColor.substring(0, 2), 16) / 255;
                    const g = parseInt(hexColor.substring(2, 4), 16) / 255;
                    const b = parseInt(hexColor.substring(4, 6), 16) / 255;
                    const color = { red: r, green: g, blue: b, alpha: 1 };
                    
                    // Apply the fill color from the payload
                    pathNode.fill = editor.makeColorFill(color);
                    
                    // Use the translation from the payload
                    pathNode.translation = pathObj.translation;
                    
                    return pathNode;
                } catch (error) {
                    console.error(`Error creating path at index ${index}:`, error);
                    return null;
                }
            }).filter((node): node is NonNullable<typeof node> => node !== null);

            // Add all paths to the group
            if (pathNodes.length > 0) {
                group.children.append(...pathNodes);
                
                // Add the group to the new page's artboard (which is now the insertion parent)
                const insertionParent = editor.context.insertionParent;
                insertionParent.children.append(group);
                console.log(`Rendered ${pathNodes.length} paths on the new page`);
            }
        },
        createPageAndRenderImageSegments: async (
            dimensions: { width: number; height: number },
            segments: Array<{ imageBase64: string; x: number; y: number; width: number; height: number; center_x: number; center_y: number }>
        ) => {
            if (!segments || segments.length === 0) {
                console.warn("No image segments provided");
                return;
            }

            // Create a new page with the specified dimensions
            const newPage = editor.documentRoot.pages.addPage(dimensions);
            console.log("Created new page:", newPage.width, "x", newPage.height);

            // Base64 decoder (atob is not available in document sandbox)
            const base64Decode = (base64: string): Uint8Array => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                let result: number[] = [];
                let i = 0;
                base64 = base64.replace(/[^A-Za-z0-9\+\/]/g, '');
                
                while (i < base64.length) {
                    const char1 = base64.charAt(i++);
                    const char2 = base64.charAt(i++);
                    const char3 = base64.charAt(i++);
                    const char4 = base64.charAt(i++);
                    
                    const encoded1 = chars.indexOf(char1);
                    const encoded2 = chars.indexOf(char2);
                    const encoded3 = char3 === '=' ? -1 : chars.indexOf(char3);
                    const encoded4 = char4 === '=' ? -1 : chars.indexOf(char4);
                    
                    const bitmap = (encoded1 << 18) | (encoded2 << 12) | 
                                   ((encoded3 >= 0 ? encoded3 : 0) << 6) | 
                                   (encoded4 >= 0 ? encoded4 : 0);
                    
                    result.push((bitmap >> 16) & 255);
                    if (encoded3 >= 0) result.push((bitmap >> 8) & 255);
                    if (encoded4 >= 0) result.push(bitmap & 255);
                }
                
                return new Uint8Array(result);
            };

            // Load all bitmap images first (async operation)
            const bitmapImagePromises = segments.map(async (segment) => {
                try {
                    // Convert base64 string to blob
                    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
                    let base64Data = segment.imageBase64;
                    if (base64Data.includes(',')) {
                        base64Data = base64Data.split(',')[1];
                    }
                    console.log(`Decoding base64 for segment at (${segment.x}, ${segment.y}), length: ${base64Data.length}`);
                    
                    const byteArray = base64Decode(base64Data);
                    console.log(`Decoded ${byteArray.length} bytes for segment at (${segment.x}, ${segment.y})`);
                    
                    // Create blob with explicit MIME type
                    const blob = new Blob([byteArray], { type: 'image/png' });
                    console.log(`Created blob for segment at (${segment.x}, ${segment.y}), size: ${blob.size}, type: ${blob.type}`);
                    
                    // Load the bitmap image from blob
                    const bitmapImage = await editor.loadBitmapImage(blob);
                    console.log(`Loaded bitmap image for segment at (${segment.x}, ${segment.y}), dimensions: ${bitmapImage.width}x${bitmapImage.height}`);
                    
                    return { bitmapImage, segment };
                } catch (error) {
                    console.error(`Error loading bitmap for segment at (${segment.x}, ${segment.y}):`, error);
                    return null;
                }
            });

            // Wait for all bitmap images to load
            const loadedImages = await Promise.all(bitmapImagePromises);
            const validImages = loadedImages.filter((item): item is NonNullable<typeof item> => item !== null);
            
            console.log(`Successfully loaded ${validImages.length} out of ${segments.length} bitmap images`);

            // Use queueAsyncEdit to create and add image containers after async operations
            await editor.queueAsyncEdit(() => {
                const insertionParent = editor.context.insertionParent;
                const imageContainers = validImages.map(({ bitmapImage, segment }) => {
                    try {
                        // Create image container with the segment's dimensions
                        const imageContainer = editor.createImageContainer(bitmapImage, {
                            initialSize: {
                                width: segment.width,
                                height: segment.height
                            }
                        });
                        
                        // Position the image at its original coordinates (x, y from top-left)
                        imageContainer.translation = { x: segment.x, y: segment.y };
                        
                        console.log(`Created image container at (${segment.x}, ${segment.y}) with size ${segment.width}x${segment.height}`);
                        
                        return imageContainer;
                    } catch (error) {
                        console.error(`Error creating image container for segment at (${segment.x}, ${segment.y}):`, error);
                        return null;
                    }
                });

                const validContainers = imageContainers.filter((container): container is NonNullable<typeof container> => container !== null);
                
                // Add all images to the new page's artboard
                if (validContainers.length > 0) {
                    insertionParent.children.append(...validContainers);
                    console.log(`Rendered ${validContainers.length} image segments on the new page`);
                } else {
                    console.warn("No valid image containers to add");
                }
            });
        },
        applyFontToText: async (fontFamily: string) => {
            /**
             * Apply a font to the currently selected text element(s).
             * @param fontFamily - The font family name (e.g., "Arial", "Times New Roman")
             */
            try {
                const selection = editor.context.selection;
                if (selection.length === 0) {
                    console.warn("No text element selected");
                    return { success: false, message: "Please select a text element first" };
                }

                // Try to find the font by family name
                // Note: We need to search through available fonts or use PostScript name
                // For now, we'll try common PostScript name patterns
                const fontPostScriptNames = [
                    fontFamily.replace(/\s+/g, ""), // Remove spaces
                    fontFamily.replace(/\s+/g, "-"), // Replace spaces with hyphens
                    `${fontFamily.replace(/\s+/g, "")}-Regular`,
                    `${fontFamily.replace(/\s+/g, "-")}-Regular`,
                ];

                let selectedFont = null;
                for (const psName of fontPostScriptNames) {
                    selectedFont = await fonts.fromPostscriptName(psName);
                    if (selectedFont && selectedFont.availableForEditing) {
                        break;
                    }
                }

                // If no font found, try to get all available fonts and match by family name
                if (!selectedFont || !selectedFont.availableForEditing) {
                    // Fallback: try to find by family name in available fonts
                    // This is a simplified approach - in production, you'd want a more robust font matching
                    console.warn(`Font "${fontFamily}" not found. Using default font.`);
                    selectedFont = await fonts.fromPostscriptName("SourceSans3-Regular");
                }

                if (!selectedFont || !selectedFont.availableForEditing) {
                    return { success: false, message: `Font "${fontFamily}" is not available` };
                }

                // Apply font to all selected text elements
                await editor.queueAsyncEdit(() => {
                    selection.forEach((textNode) => {
                        if (textNode.type === "text") {
                            const contentModel = textNode.fullContent;
                            const existingStyles = contentModel.characterStyleRanges;
                            
                            // Apply font to all character style ranges
                            existingStyles.forEach((style) => {
                                style.font = selectedFont;
                            });
                            
                            contentModel.characterStyleRanges = existingStyles;
                        }
                    });
                });

                return { 
                    success: true, 
                    message: `Font "${selectedFont.family}" applied successfully`,
                    fontFamily: selectedFont.family 
                };
            } catch (error) {
                console.error("Error applying font:", error);
                return { success: false, message: `Error applying font: ${error}` };
            }
        }
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
