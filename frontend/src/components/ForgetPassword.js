import React, { useState } from 'react';
import axios from 'axios';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:8000/password-reset/forget-password', { email }); // Updated URL
            setMessage(response.data.message);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError(err.response.data.detail || 'An error occurred.'); // Handle errors
            setMessage(''); // Clear any previous success messages
        }
    };
    

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default ForgetPassword;
