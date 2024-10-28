import React from 'react';
import '../styles/EventCard.css';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import { Paper, CardMedia } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import washuLogo from '../assets/washuLogo.png';


const EventCard = ({ event, onDelete }) => {
  const { id, name, date, time, address, details_of_event, username, image_url } = event;
  const currUser = localStorage.getItem('username');
  const navigate = useNavigate();
  const displayedImage = image_url || washuLogo;
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
    if (confirmDelete) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  const handleUsernameClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <Paper className="event-card">
      <div className="event-details" onClick={handleCardClick}>
      <CardMedia
  component="img"
  sx={{
    width: '100%',           
    height: '150px',         
    objectFit: 'contain',     
    margin: '0 auto',         
    borderRadius: '8px',      
  }}
  image={displayedImage}
  alt="Event Image"
/>


        <h2 className="event-title"><strong>{name}</strong></h2>
      </div>
      <p className="event-user" onClick={handleUsernameClick}>{username}</p>
      <div className="event-details" onClick={handleCardClick}>
        <p className="event-date"><CalendarMonthIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {date}</p>
        <p className="event-time"><AccessTimeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {time}</p>
        <p className="event-location"><PlaceIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {address}</p>
        <p className="event-description">{details_of_event}</p>
      </div>
      <Button size="small" color="primary" onClick={handleSave} sx={{ marginTop: 'auto' }}> Save </Button>

      {/* Show Edit and Delete buttons only if the current user is the creator of the event */}
      {username === currUser && (
        <>
          <Button size="small" color="error" onClick={handleDelete} sx={{ marginTop: 'auto', marginLeft: '10px' }}> Delete </Button>
          <Button size="small" color="secondary" onClick={handleEdit} sx={{ marginTop: 'auto', marginLeft: '10px' }}> Edit </Button>
        </>
      )}
    </Paper>
  );
};

export default EventCard;