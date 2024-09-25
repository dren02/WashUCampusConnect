import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import '../styles/MainPage.css';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom'
import axios from 'axios';

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events'); 
        setEvents(response.data);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch events.');
      } finally {
        setLoading(false); 
      }
    };
    fetchEvents();
  }, []);


  if (loading) return <Typography variant="h6">Loading events...</Typography>;
  if (error) return <Typography variant="h6">{error}</Typography>;

  return (
    <div className="main-page-container">
      <Box component={Link} to="/profile" className="link-box">
        <Avatar src="/broken-image.jpg" />
        <Typography variant="body1" className="profile-text" >
          Profile
        </Typography>
      </Box>
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
