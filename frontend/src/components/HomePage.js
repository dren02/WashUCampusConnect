import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import logo from '../assets/washuLogo.png';


const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to WashU CampusConnect</h1>
      <div className="button-container">
        <Link to="/signup" className="button">Sign Up</Link>
        <Link to="/login" className="button">Log In</Link>
      </div>
      <img src={logo} alt="WashU Logo" className="logo" /> 
    </div>
  );
};

export default HomePage;
