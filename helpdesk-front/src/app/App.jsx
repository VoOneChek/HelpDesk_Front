import React from 'react';
import { AuthProvider } from '../context/AuthContext.jsx';
import { RefreshProvider } from '../context/RefreshContext.jsx';
import AppRouter from '../router/AppRouter.jsx';

function App() {
    return (
        <AuthProvider>
            <RefreshProvider>
                <AppRouter />
            </RefreshProvider>
        </AuthProvider>
    );
}

export default App;