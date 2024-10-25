import React, { useState, useEffect } from 'react';
import '../styles/makePost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MakePost = ({ event, closeModal }) => {
  const [name, setName] = useState(event ? event.name : '');
  const [date, setDate] = useState(event ? event.date : '');
  const [time, setTime] = useState(event ? event.time : '');
  const [address, setAddress] = useState(event ? event.address : '');
  const [details_of_event, setDetails] = useState(event ? event.details_of_event : '');
  const [image, setImage] = useState(null); // New state for image file
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      name,
      date,
      time,
      address,
      details_of_event,
      username,
    };
    
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => formData.append(key, value));
    
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post('http://localhost:8000/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Event created:', formData);
      closeModal();
      navigate(0); // Reload the current page to reflect the newly created event
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Create or Edit Event</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Existing form fields */}
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
              value={details_of_event}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image">Event Image</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
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
