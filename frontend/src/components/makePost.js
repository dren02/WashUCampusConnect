import React, { useState } from 'react';
import '../styles/makePost.css';

const MakePost = ({ event, closeModal }) => {
  const [name, setName] = useState(event ? event.name : '');
  const [date, setDate] = useState(event ? event.date : '');
  const [time, setTime] = useState(event ? event.time : '');
  const [address, setAddress] = useState(event ? event.address : '');
  const [details, setDetails] = useState(event ? event.details_of_event : '');
  const [username, setUsername] = useState(event ? event.username : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submit logic, possibly sending data to an API
    console.log({
      name,
      date,
      time,
      address,
      details,
      username
    });
    closeModal(); // Close the popup after submit
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Create or Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="details">Event Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit">Save Event</button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePost;
