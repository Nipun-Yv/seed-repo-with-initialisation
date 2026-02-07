// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { ClientStorage, AddOnSDKAPI } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

import { generateCodeChallenge,generateRandomString,base64URLEncode } from "../utils/pkce";
import { BACKEND_API_URL } from "../utils/constants";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = PropsWithChildren<{
    store: ClientStorage;
    addOnUISdk: AddOnSDKAPI;
}>;


export const AuthProvider = ({ store, children, addOnUISdk }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const sessionId = await store.getItem("session_id");
            
            if (sessionId) {
                await verifySession(sessionId as string);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const verifySession = async (sessionId: string) => {
        const response = await fetch(`${BACKEND_API_URL}/api/auth/session?session_id=${sessionId}`);
        
        if (!response.ok) {
            throw new Error('Session verification failed');
        }
        
        const data = await response.json();
        
        await store.setItem("session_id", sessionId);
        setIsAuthenticated(true);
        setUser(data);
        
        console.log('Session verified:', data);
    };


    const login = async () => {
        try {
            const codeVerifier = generateRandomString(64);
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            const state = generateRandomString(32);
            
            await store.setItem("pkce_code_verifier", codeVerifier);
            await store.setItem("oauth_state", state);
            
            const registerResponse = await fetch(`${BACKEND_API_URL}/api/auth/register-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state })
            });
            
            if (!registerResponse.ok) {
                throw new Error('Failed to register state');
            }
            
            console.log('Starting Dropbox authorization...');
            
            const result = await addOnUISdk.app.oauth.authorize({
                authorizationUrl: "https://www.dropbox.com/oauth2/authorize",
                clientId: "u858lvwg86bieyb",
                scope: "", 
                codeChallenge: codeChallenge
            });
            
            console.log('OAuth completed');
            
            if (!result.code) {
                throw new Error("Code not received");
            }
            
            const storedCodeVerifier = await store.getItem("pkce_code_verifier") as string;
            const storedState = await store.getItem("oauth_state") as string;
            
            console.log('Exchanging code for token...');
            
            const tokenResponse = await fetch(`${BACKEND_API_URL}/api/auth/dropbox/exchange`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: result.code,
                    state: storedState,
                    redirect_uri: result.redirectUri,
                    code_verifier: storedCodeVerifier
                })
            });
            
            if (!tokenResponse.ok) {
                const error = await tokenResponse.json();
                throw new Error(error.detail || 'Token exchange failed');
            }
            
            const data = await tokenResponse.json();
            
            await verifySession(data.session_id);
            
            await store.removeItem("pkce_code_verifier");
            await store.removeItem("oauth_state");
            
            console.log('Login successful!');
            
        } catch (error: any) {
            console.error('Login failed:', error);
            
            await store.removeItem("pkce_code_verifier");
            await store.removeItem("oauth_state");
            await store.removeItem("session_id");
            
            setIsAuthenticated(false);
            setUser(null);
            
            throw error;
        }
    };

    const logout = async () => {
        try {
            const sessionId = await store.getItem("session_id");
            
            if (sessionId) {
                await fetch(`${BACKEND_API_URL}/api/auth/logout?session_id=${sessionId}`, {
                    method: 'POST'
                });
            }
            
            await store.removeItem("session_id");
            setIsAuthenticated(false);
            setUser(null);
            
            console.log('Logged out successfully');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
