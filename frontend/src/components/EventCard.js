import React from 'react';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const { title, date, location, description } = event;

  return (
    <div className="event-card">
      <h2 className="event-title">{title}</h2>
      <p className="event-date"><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      <p className="event-location"><strong>Location:</strong> {location}</p>
      <p className="event-description">{description}</p>
      {/*  add more details or actions here,like a "Register" button or something */}
    </div>
  );
};

export default EventCard;
