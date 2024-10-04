import React from 'react';
import '../styles/EventCard.css';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import axios from 'axios';

const EventCard = ({ event }) => {
  const { id, name, date, time, address, details_of_event, username } = event;
  const currUser = localStorage.getItem('username')

  const handleSave = async () => {
      try {
          const response = await axios.put(`http://localhost:8000/auth/${currUser}/save-event/`, {
              eventId: id
          });
          alert(response.data.message);
      } catch (error) {
          console.error("Error saving event:", error);
          alert("An error occurred while saving the event.");
      }
  };
  
  return (
    <div className="event-card">
      <h2 className="event-title"><strong>{name}</strong></h2>
      <p className="event-description">{username}</p>
      {/* <p className="event-date">{new Date(date).toLocaleDateString()}</p> */}
      <p className="event-date"> <CalendarMonthIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {date}</p>
      <p className="event-time"><AccessTimeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {time}</p>
      <p className="event-location"><PlaceIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {address}</p>
      <p className="event-description">{details_of_event}</p>
      {/*  add more details or actions here,like a "Register" button or something */}
      <Button size="small" color="primary" onClick={handleSave} sx={{ marginTop: 'auto' }}> Save </Button>
    </div>
  );
};

export default EventCard;
