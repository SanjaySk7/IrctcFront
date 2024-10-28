import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Login from './Component/login';
import Signup from './Component/signup';
import Users from './Pages/Users/users';
import Admin from './Pages/Admin/admin';
import './App.css';

const MainContent = () => {
    const [role, setRole] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const handleRoleToggle = (selectedRole) => {
        setRole(selectedRole);
        navigate('/login'); 
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="app-container">
            {location.pathname !== '/signup' && location.pathname !== '/users' && location.pathname !== '/admin' && (
                 <>
                 <h1 className="welcome-heading">Welcome to IRCTC</h1>
                <div className="role-toggle-buttons">
                    <button
                        onClick={() => handleRoleToggle('User')}
                        className={role === 'User' ? 'toggle-button active' : 'toggle-button'}
                    >
                        User
                    </button>
                    <button
                        onClick={() => handleRoleToggle('Admin')}
                        className={role === 'Admin' ? 'toggle-button active' : 'toggle-button'}
                    >
                        Admin
                    </button>
                </div>
                </>
            )}

            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login role={role} onSignupClick={handleSignupClick} />} />
                <Route path="/users" element={<Users />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </div>
    );
};

export default MainContent;
