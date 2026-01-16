import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, EditorEvent, constants } from "express-document-sdk";
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
        
        getSelectionState: async () => {
            const selection = editor.context.selection;
            const isImage = selection.length === 1 && selection[0].type === constants.SceneNodeType.mediaContainer;
            return {
                hasSelection: selection.length > 0,
                selectionCount: selection.length,
                isImage: isImage,
                selectedNodeId: selection.length > 0 ? selection[0].id : undefined
            };
        },
        
        getSelectedImageBlob: async () => {
            try {
                const selection = editor.context.selection;
                
                if (selection.length !== 1 || selection[0].type !== constants.SceneNodeType.mediaContainer) {
                    return null;
                }
                
                const mediaContainer: any = selection[0];
                // @ts-expect-error - mediaRectangle exists on MediaContainerNode at runtime
                const mediaRectangle: any = mediaContainer.mediaRectangle;
                
                if (mediaRectangle?.type === constants.SceneNodeType.imageRectangle && 
                    typeof mediaRectangle.fetchBitmapImage === 'function') {
                    const bitmapImage = await mediaRectangle.fetchBitmapImage();
                    const blob = await bitmapImage.data();
                    return blob;
                }
                
                return null;
            } catch (error) {
                console.error('Error getting selected image:', error);
                return null;
            }
        }
    };

    // Register selection change event listener
    function updatePropertiesPanel() {
        const selection = editor.context.selection;
        
        if (selection.length === 0) {
            console.log("Properties Panel: Show 'Nothing Selected' state");
            return;
        }
        
        if (selection.length === 1) {
            const node = selection[0];
            console.log("Properties Panel: Show properties for", node.type);
            
            // Show different properties based on node type
            if (node.type === "Text") {
                console.log("  - Show font controls");
                console.log("  - Show text color picker");
            } else if (node.type === "Rectangle" || node.type === "Ellipse") {
                console.log("  - Show fill color picker");  
                console.log("  - Show stroke controls");
            }
            
            // Common properties for all nodes
            console.log("  - Show position controls");
            console.log("  - Show size controls");
            
        } else {
            console.log("Properties Panel: Show multi-selection options");
            console.log(`  - ${selection.length} items selected`);
            console.log("  - Show alignment tools");
            console.log("  - Show group option");
        }
    }

    // Register the handler
    editor.context.on(EditorEvent.selectionChange, updatePropertiesPanel);

    // Call once on startup to initialize
    updatePropertiesPanel();

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();