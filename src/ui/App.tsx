import { AddOnSDKAPI, ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { Sparkles, Search, Type, LayoutDashboard } from "lucide-react"; // Lightweight icons
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";
import BrandSearch from "./brand_search/BrandSearch";
import FontSearch from "./font_search/FontSearch";
import VariantGen from "./modify/VariantGen";

const App = ({
    addOnUISdk,
    sandboxProxy,
    store,
}: {
    addOnUISdk: AddOnSDKAPI;
    sandboxProxy: DocumentSandboxApi;
    store: ClientStorage;
}) => {
    
    // Optimized for narrow sidebars
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200 border-b-2 ${
            isActive 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        }`;

    return (
        <HashRouter>
            <div className="flex flex-col h-screen bg-white text-slate-900 overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100">
                    <div className="bg-blue-600 p-1 rounded-md">
                        <LayoutDashboard size={14} className="text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Design Workspace
                    </span>
                </div>

                {/* Main Navigation - Tab Style */}
                <nav className="flex w-full bg-white border-b border-slate-200">
                    <NavLink to="/" className={navLinkClass} end title="Variant Gen">
                        <Sparkles size={18} />
                        <span className="text-[10px] mt-1 font-medium">Variants</span>
                    </NavLink>
                    
                    <NavLink to="/brand-search" className={navLinkClass} title="Brand Search">
                        <Search size={18} />
                        <span className="text-[10px] mt-1 font-medium">Brands</span>
                    </NavLink>
                    
                    <NavLink to="/font-search" className={navLinkClass} title="Font Search">
                        <Type size={18} />
                        <span className="text-[10px] mt-1 font-medium">Fonts</span>
                    </NavLink>
                </nav>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <Routes>
                        <Route
                            path="/"
                            element={<VariantGen addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy} store={store} />}
                        />
                        <Route path="/brand-search" element={<BrandSearch addOnUISdk={addOnUISdk} />} />
                        <Route path="/font-search" element={<FontSearch sandboxProxy={sandboxProxy} />} />
                        <Route
                            path="*"
                            element={<VariantGen addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy} store={store} />}
                        />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;