import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ role, onSignupClick }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const validateInput = (name, value) => {
        let message = "";

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) message = "Email is required.";
            else if (!emailRegex.test(value)) message = "Invalid email format.";
        }

        if (name === "password") {
            if (!value) message = "Password is required.";
            else if (value.length < 4) message = "Password must be at least 4 characters.";
        }

        setError((prevError) => ({
            ...prevError,
            [name]: message,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        validateInput(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password || error.email || error.password) {
            setError((prevError) => ({
                ...prevError,
                form: "Please fill all the fields.",
            }));
            return;
        }

        if (role === 'Admin') {
            if (formData.email === 'admin@gmail.com' && formData.password === 'admin10') {
                navigate('/admin');
                return;
            } else {
                setError((prevError) => ({ ...prevError, form: "No matching record found." }));
                return;
            }
        }

        try {
            const res = await axios.post('https://irctcback-1.onrender.com/login', formData);
            if (res.data.userId) {
                localStorage.setItem('userId', res.data.userId);
                navigate('/users');
            } else {
                setError((prevError) => ({ ...prevError, form: "No matching record found." }));
            }
        } catch (err) {
            setError((prevError) => ({
                ...prevError,
                form: "Invalid email or password. Please try again.",
            }));
        }
    };

    return (
        <div className="login-container">
            <div className="login-heading"><h3>{role} Login</h3></div>
            <form onSubmit={handleSubmit} className="login-form">
                <label>Email: </label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {error.email && <p className="error-message">{error.email}</p>}

                <label>Password: </label>
                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {error.password && <p className="error-message">{error.password}</p>}

                <button type="submit">Login</button>
                {error.form && <p className="error-message">{error.form}</p>}
                {role !== 'Admin' && (
                <p>
                    Don't have an account?{' '}
                    <span 
                        className="signup-link" 
                        onClick={onSignupClick}
                    >
                        Sign Up
                    </span>
                </p>
                )}
            </form>
        </div>
    );
};

export default Login;
