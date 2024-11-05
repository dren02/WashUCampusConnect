import React from 'react';
import '../styles/EventCard.css';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import washuLogo from '../assets/washuLogo.png';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const EventCard = ({ event, onDelete }) => { // Removed showRSVP prop
  const { id, name, date, time, address, details_of_event, username, image_url } = event;
  const currUser = localStorage.getItem('username');
  const navigate = useNavigate();
  const displayedImage = image_url || washuLogo;

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/auth/${currUser}/save-event/`, {
        eventId: id,
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
      await onDelete(id);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  const handleUsernameClick = (e) => {
    e.stopPropagation(); // Prevent the card click event
    navigate(`/profile/${username}`);
  };

  return (
    <Card sx={{ maxWidth: 345 }} >
      <div className="event-details" onClick={handleCardClick}>
      <CardMedia
        sx={{ height: 180 }}
        image={displayedImage}
        title="event image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" onClick={handleUsernameClick} sx={{ marginBottom: 1, color: 'text.secondary', cursor: 'pointer', '&:hover': {textDecoration: 'underline',},}}>
          {username}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.secondary' }}>
          <CalendarMonthIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> 
          {date}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.secondary' }}>
          <AccessTimeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> 
          {time}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1.5, color: 'text.secondary' }}>
          <PlaceIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> 
          {address}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {details_of_event}
        </Typography>
      </CardContent>
      </div>
      <CardActions>
        <Button size="small" onClick={handleSave}>Save</Button>
        {username === currUser && (
          <>
            <Button size="small" color="error" onClick={handleDelete} sx={{ marginLeft: '10px' }}> Delete </Button>
            <Button size="small" color="secondary" onClick={handleEdit} sx={{ marginLeft: '10px' }}> Edit </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}

export default EventCard;
