import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignUpPage.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!role) {
      alert("Please select a role!");
      return;
    }

    try {
      await axios.post('http://localhost:8000/auth/signup/', {
        username,
        password,
        email,
        role,
      });
      setSuccess('Account created successfully! Redirecting to login page...');
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (error) {
      console.error('Error during sign-up:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        setError(`Failed to create account: ${error.response.data.detail}`);
      } else {
        setError('Failed to create account: An unknown error occurred.');
      }
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

        <div className="form-group">
          <label className="form-label">Select Role:</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="event_creator"
                checked={role === 'event_creator'}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <span>Event Creator</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="event_attendee"
                checked={role === 'event_attendee'}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <span>Event Attendee</span>
            </label>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Log In</a></p>
    </div>
  );
};

export default SignUp;
