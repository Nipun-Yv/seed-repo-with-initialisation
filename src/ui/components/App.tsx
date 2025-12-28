// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import {Button} from "@/src/components/ui/button"
import { Theme } from "@swc-react/theme";
import React, { useState } from "react";
import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import "./App.css";

import { AddOnSDKAPI, ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

const App = ({ addOnUISdk, sandboxProxy ,store}: { addOnUISdk: AddOnSDKAPI; sandboxProxy: DocumentSandboxApi,
    store:ClientStorage
}) => {
    function handleClick() {
        sandboxProxy.createRectangle();
    }

    function storeName(){

    }
    const [name,setName]=useState("");
    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme system="express" scale="medium" color="light" className="h-full">
            <div className="justify-center p-[10px] items-center w-full bg-black
            h-full">
                <button  onClick={handleClick} className="w-5/6">
                    Create Rectangle
                </button>

                <input value={name} onChange={e=>setName(e.currentTarget.value)}
                className="w-1/2"/>
                <button onClick={handleClick} className="w-5/6">
                    Create Rectangle
                </button>
                
            </div>
        </Theme>
    );
};

export default App;
