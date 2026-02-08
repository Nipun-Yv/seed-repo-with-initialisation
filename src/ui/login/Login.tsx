// src/global/Login.tsx
import React, { useState, useEffect } from "react";
import { LogIn, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { login } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const authError = urlParams.get('error');
        
        if (authError) {
            const errorMessages: { [key: string]: string } = {
                'invalid_state': 'Security validation failed. Please try again.',
                'token_exchange_failed': 'Failed to exchange authorization code. Please try again.',
                'unexpected_error': 'An unexpected error occurred. Please try again.'
            };
            
            setError(errorMessages[authError] || 'Authentication failed. Please try again.');
        }
    }, []);

    const handleDropboxLogin = async () => {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await login();
            setMessage("Please complete authorization in the popup window...\n");
            navigate("/")
        } catch (err) {
            if(err.message=="POPUP_BLOCKED"){
                setError("Kindly enable pop-ups for your browser to log in and please try again")
            }
            else{
                setError("Failed to initiate Dropbox login. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    {/* <div className="flex items-center justify-center mb-6">
                        <div className="bg-blue-600 p-3 rounded-lg">
                            <LogIn size={24} className="text-white" />
                        </div>
                    </div> */}
                    
                    <h2 className="text-xl font-bold text-center mb-2">Welcome Back</h2>
                    <p className="text-sm text-slate-500 text-center mb-6">
                        Connect your Dropbox account to continue
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-600">{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
                            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-600">{message}</span>
                        </div>
                    )}

                    <button
                        onClick={handleDropboxLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 1.5l-6 4.5 6 4.5 6-4.5-6-4.5zm-6 13.5l6 4.5 6-4.5-6-4.5-6 4.5zm12 0l6 4.5 6-4.5-6-4.5-6 4.5zm6-9l-6-4.5-6 4.5 6 4.5 6-4.5zm-6 10.5l-6 4.5v4.5l6-4.5v-4.5z"/>
                        </svg>
                        {loading ? "Connecting..." : "Connect with Dropbox"}
                    </button>
                    
                    <p className="text-xs text-slate-400 text-center mt-4">
                        A popup window will open for authorization
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
