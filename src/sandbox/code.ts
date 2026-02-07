import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, EditorEvent, constants, fonts } from "express-document-sdk";
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
        // logAvailableFontIndicesFromConstants:async (
        // l: number, h:number
        // ) :Promise<void> =>{
        // const names = typeof l === "number"
        //     ? POST_SCRIPT_NAMES.slice(l,h)
        //     : POST_SCRIPT_NAMES;

        // const availableIndices: number[] = [];

        // // Probe in parallel (be mindful if your list is huge)
        // const results = await Promise.all(
        //     names.map((psName, idx) =>
        //     fonts.fromPostscriptName(psName).then((font) => ({ idx, psName, font }))
        //     )
        // ); // fromPostscriptName is async and returns undefined when unavailable. [web:17]

        // for (const r of results) {
        //     if (r.font) {
        //     availableIndices.push(r.idx+l);
        //     }
        // }

        // console.log(
        //     `Available fonts: ${availableIndices.length}/${names.length}. Indices:`,
        //     availableIndices
        // );
        // },
        applyFontToSelectedText: async (fontPostscriptName: string) => {
            try {
                const selection = editor.context.selection;
                console.log(selection)
                
                // Check if we have exactly one text node selected
                if (selection.length !== 1 || selection[0].type !== constants.SceneNodeType.text) {
                    console.warn('Please select a text node to apply the font');
                    return false;
                }
                const textNode = selection[0] as any;
                
                // Get the font by PostScript name
                const font = await fonts.fromPostscriptName(fontPostscriptName);
                
                if (!font) {
                    console.warn(`Font with PostScript name "${fontPostscriptName}" is not available for editing`);
                    return false;
                }
                
                // Apply the font to all text using queueAsyncEdit
                await editor.queueAsyncEdit(() => {
                    // @ts-expect-error - fullContent exists on TextNode at runtime
                    const contentModel = textNode.fullContent;
                    // Apply font to the entire text content
                    contentModel.applyCharacterStyles({ font: font });
                });
                
                return true;
            } catch (error) {
                console.error('Error applying font to text:', error);
                return false;
            }
        },
        
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
    // sandbox/code.ts (your file)



    // Register the handler
    editor.context.on(EditorEvent.selectionChange, updatePropertiesPanel);

    // Call once on startup to initialize
    updatePropertiesPanel();

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
