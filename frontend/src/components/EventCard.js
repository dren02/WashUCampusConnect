import React from 'react';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const { id, name, date, time, address, details_of_event, username } = event;
  
  return (
    <div className="event-card">
      <h2 className="event-title"><strong>{name}</strong></h2>
      <p className="event-description">{username}</p>
      {/* <p className="event-date">{new Date(date).toLocaleDateString()}</p> */}
      <p className="event-date">{date}</p>
      <p className="event-time">{time}</p>
      <p className="event-location">{address}</p>
      <p className="event-description">{details_of_event}</p>
      {/*  add more details or actions here,like a "Register" button or something */}
    </div>
  );
};

export default EventCard;
