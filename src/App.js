import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import ForgotPassword from './components/forgotpass';
import ChangePassword from './components/changepass';
import Game from './components/game';
import ProtectedRoute from './components/protected_route';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpass" element={<ForgotPassword setIsAuthenticated={setIsAuthenticated} />} />
                <Route
                    path="/changepass"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />
                <Route path="/game" element={<Game />} />
            </Routes>
        </Router>
    );
}

export default App;
