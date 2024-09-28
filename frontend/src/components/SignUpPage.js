import React, { useState } from 'react';
import axios from 'axios';  // Import axios for API requests
import '../styles/SignUpPage.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  // You can store this for future use if you handle email later
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      // Make a POST request to the FastAPI sign-up endpoint
      const response = await axios.post('http://localhost:8000/auth/signup/', {
        username,
        password,
        email,
      });
      // If the sign-up is successful
      setSuccess('Account created successfully!');
      setError('');
      navigate('/');
    } catch (error) {
      // Handle error (e.g., username already exists)
      console.error('Error during sign-up:', error);
      setError('Failed to create account. Username might already exist.');
      setSuccess('');
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        {success && <p className="success-message">{success}</p>} {/* Display success message */}
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
