import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const validateInput = (name, value) => {
        let message = "";

        if (name === "name") {
            if (!value) message = "Name is required.";
        }

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
            [name]: value
        }));
        validateInput(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || error.name || error.email || error.password) {
            setError((prevError) => ({
                ...prevError,
                form: "Please fill all the details.",
            }));
            return;
        }

        try {
            const res = await axios.post('https://irctcback-1.onrender.com/irctc', formData);
            navigate('/login');
        } catch (err) {
            setError((prevError) => ({
                ...prevError,
                form: "Failed to register. Please try again.",
            }));
        }
    };

    const handleBack=()=>{
        navigate('/login');
    }

    return (
        <div className="signup-container">
            <div className='signup-heading'><h3>Sign Up</h3></div>
            <form onSubmit={handleSubmit} className="signup-form">
                <label>Name: </label>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                />
                {error.name && <p className="error-message">{error.name}</p>}

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

                <button type="submit" className='signup-form button'>Sign Up</button>
                {error.form && <p className="error-message">{error.form}</p>}
                <p className="back-to-login" onClick={handleBack}>Back to Login</p>
            </form>
        </div>
    );
};

export default Signup;
