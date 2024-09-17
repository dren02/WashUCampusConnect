import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const [events, setEvents] = useState([]);

  /*useEffect(() => {
    // Fetch data from FastAPI backend
    fetch('http://127.0.0.1:8000/')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data); // Save the events data to the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); */

  return (
    <div className="home-container">
      <h1>Welcome to Campus Website</h1>
      <div className="button-container">
        <Link to="/signup" className="button">Sign Up</Link>
        <Link to="/login" className="button">Log In</Link>
      </div>
      
   <div className="events-container">
        <h2>Events:</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event.name}</li>
            ))}
          </ul>
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div> 
  );
};

export default HomePage;
