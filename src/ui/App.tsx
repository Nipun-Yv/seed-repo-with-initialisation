import { AddOnSDKAPI, ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
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
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${
            isActive ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:text-slate-900"
        }`;

    return (
        <HashRouter>
            <div className="w-full">
                <nav className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
                    <span className="text-sm font-semibold text-slate-700 mr-2">Workspace</span>
                    <NavLink to="/" className={navLinkClass} end>
                        Variant Gen
                    </NavLink>
                    <NavLink to="/brand-search" className={navLinkClass}>
                        Brand Search
                    </NavLink>
                    <NavLink to="/font-search" className={navLinkClass}>
                        Font Search
                    </NavLink>
                </nav>
                <Routes>
                    <Route
                        path="/"
                        element={<VariantGen addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy} store={store} />}
                    />
                    <Route path="/brand-search" element={<BrandSearch />} />
                    <Route path="/font-search" element={<FontSearch />} />
                    <Route
                        path="*"
                        element={<VariantGen addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy} store={store} />}
                    />
                </Routes>
            </div>
        </HashRouter>
    );
};

export default App;