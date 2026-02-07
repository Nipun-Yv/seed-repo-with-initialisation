// src/App.tsx
import { AddOnSDKAPI, ClientStorage } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import { HashRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Search, Type, LayoutDashboard, LogOut } from "lucide-react";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "./global/ProtectedRoute";
import BrandSearch from "./brand_search/BrandSearch";
import FontSearch from "./font_search/FontSearch";
import VariantGen from "./variant_gen/VariantGen";
import Login from "./global/Login";
import { Button } from "@swc-react/button";

const AppContent = ({
    addOnUISdk,
    sandboxProxy,
    store,
}: {
    addOnUISdk: AddOnSDKAPI;
    sandboxProxy: DocumentSandboxApi;
    store: ClientStorage;
}) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200 border-b-2 ${
            isActive 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        }`;

    return (
        <div className="flex flex-col h-screen bg-white text-slate-900 overflow-hidden">
            {isAuthenticated && (
                <>
                    <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1 rounded-md">
                                <LayoutDashboard size={14} className="text-white" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Design Workspace
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                            title="Logout"
                        >
                            <LogOut size={14} className="text-slate-500" />
                        </button>
                    </div>

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
                </>
            )}

            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <VariantGen addOnUISdk={addOnUISdk} store={store}/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/brand-search"
                        element={
                            <ProtectedRoute>
                                <BrandSearch addOnUISdk={addOnUISdk} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/font-search"
                        element={
                            <ProtectedRoute>
                                <FontSearch sandboxProxy={sandboxProxy} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
};

const App = ({
    addOnUISdk,
    sandboxProxy,
    store
}: {
    addOnUISdk: AddOnSDKAPI;
    sandboxProxy: DocumentSandboxApi;
    store: ClientStorage;
}) => {
    return (
            <AuthProvider store={store} addOnUISdk={addOnUISdk}>
                <HashRouter>
                    <AppContent 
                        addOnUISdk={addOnUISdk} 
                        sandboxProxy={sandboxProxy} 
                        store={store} 
                    />
                </HashRouter>

            </AuthProvider>
    );
};

export default App;
