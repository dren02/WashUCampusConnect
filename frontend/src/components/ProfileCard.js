import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import washuLogo from '../assets/washuLogo.png';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ProfileCard = ({ event, onDelete }) => {
    const { id, name, date, time, address, details_of_event, username } = event;
    const currUser = localStorage.getItem('username');
    const navigate = useNavigate();

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
        try {
            await axios.delete(`http://localhost:8000/events/${id}`);
            alert('Event deleted successfully');
            onDelete(id);
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("An error occurred while deleting the event.");
        }
    };

    const handleEdit = () => {
        navigate(`/edit-event/${id}`); // Navigate to edit event page
    };

    return (
        <Card sx={{ display: 'flex', maxWidth: 900, margin: 1 }}>
            <CardActionArea sx={{ display: 'flex', flexDirection: 'row' }}>
                <CardMedia
                    component="img"
                    sx={{ width: '100px', height: 'auto', marginLeft: '35px' }}
                    image={washuLogo}
                    alt="WashU Logo"
                />
                <CardContent sx={{ flex: 1, textAlign: 'left', marginLeft: '30px' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                        <CalendarMonthIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                        <AccessTimeIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} fontSize="small" /> {time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5 }}>
                        <PlaceIcon sx={{ marginRight: 1 }} fontSize="small" /> {address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {details_of_event}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: '10px' }}>
                <Button size="small" color="primary" onClick={handleSave} sx={{ marginBottom: 1 }}> {/* 10px space by using marginBottom */}
                    Save
                </Button>
                
                {/* Show Edit and Delete buttons only if the current user is the creator of the event */}
                {username === currUser && (
                    <>
                        <Button size="small" color="error" onClick={handleDelete} sx={{ marginBottom: 1 }}>
                            Delete
                        </Button>
                        <Button size="small" color="secondary" onClick={handleEdit}>
                            Edit
                        </Button>
                    </>
                )}
            </CardActions>
        </Card>
    );
};

export default ProfileCard;