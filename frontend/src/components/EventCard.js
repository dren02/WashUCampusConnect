import React from 'react';
import '../styles/EventCard.css';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';

const EventCard = ({ event }) => {
  const { id, name, date, time, address, details_of_event, username } = event;
  
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
       {/* <Button size="small" color="primary"> Save </Button> */}
    </div>
  );
};

export default EventCard;
