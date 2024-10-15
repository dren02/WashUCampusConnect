import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currUser = localStorage.getItem('username');
  const [author, setAuthor] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/events/${id}`); // Adjust the API endpoint as necessary
        setEvent(response.data);
        setAuthor(response.data.username)
      } catch (err) {
        setError('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!event) return <p>No event found.</p>;

  return (
    <Box sx={{ padding: 2, minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Typography variant="h4" color="#BA0C2F" align="center" sx={{ marginBottom: 2 }}>
        {event.name}
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6"><strong>Details:</strong></Typography>
        <p>{event.details_of_event}</p>
        <p>
          <CalendarMonthIcon /> {event.date}
        </p>
        <p>
          <AccessTimeIcon /> {event.time}
        </p>
        <p>
          <PlaceIcon /> {event.address}
        </p>
      </Paper>
      {author === currUser && (
        <Button variant="contained" color="primary" onClick={() => {/* Logic for editing the event */ }}>
          Edit Event
        </Button>
      )}
    </Box>
  );
};

export default EventDetails;
