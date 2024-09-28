import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgetPassword.css'; 

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:8000/password-reset/forget-password', { email }); // Updated URL
            setMessage(response.data.message);
            setError(''); 
        } catch (err) {
            setError(err.response.data.detail || 'An error occurred.'); 
            setMessage(''); 
        }
    };

    return (
        <div className="forget-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit} className="forget-password-form">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {error && <p className="message error">{error}</p>}
            {message && <p className="message success">{message}</p>}
        </div>
    );
};

export default ForgetPassword;
