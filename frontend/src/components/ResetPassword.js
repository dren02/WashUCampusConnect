import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/ResetPassword.css'; // Import your CSS for styling

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
        console.log('Token:', token);
        console.log('Request Body:', {
        secret_token: token,
        new_password: newPassword,
        confirm_password: confirmPassword,
        });
      const response = await axios.post('http://localhost:8000/password-reset/reset-password', {
        secret_token: token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      console.log(response.data);
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to reset password. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
